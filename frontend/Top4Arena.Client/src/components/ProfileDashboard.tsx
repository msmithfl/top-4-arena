import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { User, Trophy, Star, Film, ArrowLeft, X, Search, Plus, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../utils/tmdbApi";
import Footer from "./Footer";

const ProfileDashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [stats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    achievementsUnlocked: 0,
    favoriteGenre: "None yet"
  });

  const [top4Movies, setTop4Movies] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [_isSearching, setIsSearching] = useState(false);
  const [_isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODZmYTE3MzcwNzRmMzY3NzkwNzc1Y2Q1NTQwNmExYyIsIm5iZiI6MTY4NzYyNzAzOC40MDEsInN1YiI6IjY0OTcyNTFlYjM0NDA5MDBhZDUyNTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YA8K57yrPNiM_UwefPB6Bv2t8fZdY_v1GD9AS3rRrU0';

  const handleSearchMovie = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`
          }
        }
      );
      const data = await res.json();
      setSearchResults(data.results?.slice(0, 5) || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setIsSearching(false);
  };

  const handleAddMovie = async (movieId: number) => {
    if (selectedSlot === null) return;
    
    try {
      const details = await fetchMovieDetails(movieId);
      const newMovies = [...top4Movies];
      newMovies[selectedSlot] = details;
      setTop4Movies(newMovies);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Failed to add movie:', err);
    }
  };

  const handleOpenModal = (index: number) => {
    setSelectedSlot(index);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCloseModal = () => {
    setSelectedSlot(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-dvh bg-[#14181C] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#14181C] text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        
        <div className="max-w-6xl mx-auto flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
            {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username || user.firstName || "Player"}</h1>
            <p className="text-white/70">{user.primaryEmailAddress?.emailAddress}</p>
            <p className="text-sm text-white/50 mt-1">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-6">
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* My Top 4 Films - 3/4 width */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold mb-4">My Top 4</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(index => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden relative aspect-2/3 group"
              >
                {top4Movies[index] ? (
                  <>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${top4Movies[index].poster_path}`}
                      alt={top4Movies[index].title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleOpenModal(index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <Edit2 className="w-12 h-12 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-3 pointer-events-none">
                      <p className="text-white font-bold text-sm truncate">{top4Movies[index].title}</p>
                      <p className="text-white/70 text-xs">
                        {top4Movies[index].release_date ? new Date(top4Movies[index].release_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenModal(index)}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <Plus className="w-12 h-12 mb-2" />
                    <span className="text-sm">Add Movie</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          </div>

          {/* Movie Selection Modal */}
          {selectedSlot !== null && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md relative">
                <div className="bg-[#2C3440] rounded-lg flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      {top4Movies[selectedSlot] ? 'Replace Movie' : `Select Movie for Slot ${selectedSlot + 1}`}
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 bg-[#14181C] border border-white/10 rounded-lg p-2">
                      <Search className="w-5 h-5 text-gray-400 ml-2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchMovie(e.target.value)}
                        placeholder="Search for a movie..."
                        className="flex-1 bg-transparent text-white outline-none"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-[#2C3440] rounded-lg mt-2 max-h-96 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {searchResults.map(movie => (
                        <button
                          key={movie.id}
                          onClick={() => handleAddMovie(movie.id)}
                          className="w-full p-3 hover:bg-[#3C4450] transition-colors cursor-pointer text-left rounded-lg"
                        >
                          <div className="font-bold text-white">
                            {movie.title} <span className="text-sm text-gray-400 font-normal">
                              ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats Grid - 1/4 width */}
          <div className="lg:col-span-1">
            {/* <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Stats
            </h2> */}
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Film className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-semibold">Games</h3>
                </div>
                <p className="text-2xl font-bold">{stats.gamesPlayed}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-sm font-semibold">High Score</h3>
                </div>
                <p className="text-2xl font-bold">{stats.highScore}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-semibold">Achievements</h3>
                </div>
                <p className="text-2xl font-bold">{stats.achievementsUnlocked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/game')}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all cursor-pointer"
          >
            Start New Game
          </button>
          
          <button
            disabled
            className="bg-white/10 text-white/50 font-bold py-4 px-6 rounded-lg cursor-not-allowed"
          >
            View Leaderboard (Coming Soon)
          </button>
        </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer onFeedbackClick={() => setIsFeedbackModalOpen(true)} />
      </div>
    </div>
  );
};

export default ProfileDashboard;
