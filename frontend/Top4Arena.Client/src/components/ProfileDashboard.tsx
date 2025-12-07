import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Search, Plus, Edit2 } from "lucide-react";
import { GiLaurelsTrophy } from "react-icons/gi";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../utils/tmdbApi";
import Footer from "./Footer";
import spinnerImg from '../assets/imgs/top4-spinner.png';

const ProfileDashboard = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    achievementsUnlocked: 0,
    favoriteGenre: "None yet"
  });

  const [top4Movies, setTop4Movies] = useState<any[]>([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [_isSearching, setIsSearching] = useState(false);
  const [_isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [useAsDefault, setUseAsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoadingTop4, setIsLoadingTop4] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODZmYTE3MzcwNzRmMzY3NzkwNzc1Y2Q1NTQwNmExYyIsIm5iZiI6MTY4NzYyNzAzOC40MDEsInN1YiI6IjY0OTcyNTFlYjM0NDA5MDBhZDUyNTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YA8K57yrPNiM_UwefPB6Bv2t8fZdY_v1GD9AS3rRrU0';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157';

  const loadUserStats = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          gamesPlayed: data.totalGames || 0,
          highScore: data.bestRun || 0,
          achievementsUnlocked: data.highestCombo || 0
        }));
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

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

  const loadTop4Preset = async () => {
    setIsLoadingTop4(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/users/me/top4`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUseAsDefault(data.isDefault);
        
        // Load movie details for each movie ID, maintaining 4-slot array
        if (data.movieIds && data.movieIds.length > 0) {
          const moviePromises = data.movieIds.slice(0, 4).map((id: number) => 
            id ? fetchMovieDetails(id) : Promise.resolve(null)
          );
          const movies = await Promise.all(moviePromises);
          // Pad array to exactly 4 slots
          while (movies.length < 4) {
            movies.push(null);
          }
          setTop4Movies(movies);
        }
      }
    } catch (err) {
      console.error('Failed to load Top 4 preset:', err);
    } finally {
      setIsLoadingTop4(false);
      setHasLoaded(true); // Mark as loaded after fetch completes
    }
  };

  const saveTop4Preset = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      // Create array of exactly 4 movie IDs, using 0 for empty slots
      const movieIds = [0, 1, 2, 3].map(index => top4Movies[index]?.id || 0);
      
      // Don't save if we haven't loaded yet or if trying to save all zeros when not intentional
      if (!hasLoaded) {
        setIsSaving(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/api/users/me/top4`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieIds,
          isDefault: useAsDefault
        })
      });
      
      if (response.ok) {
        console.log('Top 4 preset saved successfully', movieIds);
      } else {
        console.error('Failed to save:', await response.text());
      }
    } catch (err) {
      console.error('Failed to save Top 4 preset:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMovie = async (movieId: number) => {
    if (selectedSlot === null) return;
    
    // Check if movie is already in Top 4 (excluding the current slot being replaced)
    const existingMovie = top4Movies.find((movie, index) => 
      movie && movie.id === movieId && index !== selectedSlot
    );
    
    if (existingMovie) {
      setDuplicateError(`"${existingMovie.title}" is already in your Top 4.`);
      setTimeout(() => setDuplicateError(null), 3000);
      return;
    }
    
    try {
      const details = await fetchMovieDetails(movieId);
      
      // Check if runtime is over 240 minutes
      if (details.runtime && details.runtime > 240) {
        setDuplicateError(`"${details.title}" is too long (${details.runtime} min) for a starter. Please choose a film under 4 hours.`);
        setTimeout(() => setDuplicateError(null), 3000);
        return;
      }
      
      const newMovies = [...top4Movies];
      // Ensure array has 4 slots
      while (newMovies.length < 4) {
        newMovies.push(null);
      }
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
    } else if (isLoaded && user) {
      loadUserStats();
      loadTop4Preset();
    }
  }, [isLoaded, user, navigate]);

  // Save when movies or checkbox changes (skip initial load)
  useEffect(() => {
    if (isLoaded && user && hasLoaded) {
      // Only save if we've already loaded (not on initial mount)
      saveTop4Preset();
    }
  }, [top4Movies, useAsDefault]);

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
        
        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.username || "User"} 
                  className="w-16 md:w-24 h-16 md:h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
                  {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user.username || user.firstName || "Player"}</h1>
                {/* <p className="text-white/70">{user.primaryEmailAddress?.emailAddress}</p> */}
                <p className="text-sm text-white/50 mt-1">
                  Member Since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center gap-6 md:ml-auto md:mr-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
                <p className="text-xs text-white/50">GAMES</p>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.highScore}</p>
                <p className="text-xs text-white/50">BEST RUN</p>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {stats.achievementsUnlocked >= 1000 
                    ? `${(stats.achievementsUnlocked / 1000).toFixed(1)}k` 
                    : stats.achievementsUnlocked}
                </p>
                <p className="text-xs text-white/50">TOP COMBO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 md:p-6">
        <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 mb-4">
          {/* My Top 4 Films - 3/4 width */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-bold mb-1">TOP 4</h2>
            <div className="md:w-11/12 h-px bg-white/50 mb-3"></div>

            <div className="grid md:w-11/12 grid-cols-4 gap-4 relative">
              {isLoadingTop4 && (
                <div className="absolute inset-0 bg-[#14181C]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <img 
                    src={spinnerImg} 
                    alt="Loading" 
                    className="w-12 h-12 animate-spin" 
                  />
                </div>
              )}
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
                      <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                        <p className="hidden text-white font-bold text-sm truncate">{top4Movies[index].title}</p>
                        <p className="hidden text-white/70 text-xs">
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
                      <span className="hidden md:block text-sm">Add Movie</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Use Top 4 by Default Checkbox */}
            <div className="mt-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAsDefault}
                  onChange={(e) => setUseAsDefault(e.target.checked)}
                  disabled={isSaving}
                  className="w-6 h-6 rounded border-2 border-white/50 bg-[#14181C] checked:bg-[#14181C] checked:border-white/70 focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-lg checked:after:font-bold checked:after:leading-none disabled:opacity-50"
                />
                <span className="text-white/70">PRESET TOP 4 {isSaving && '(Saving...)'}</span>
              </label>
            </div>
          </div>

          {/* Awards - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold">AWARDS</h2>
              <span className=" text-white/50 md:mr-5">0/12</span>
            </div>
            <div className="md:w-11/12 h-px bg-white/50 mb-3"></div>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 max-h-[220px] md:max-h-[400px] overflow-y-auto scrollbar-thin pr-4">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 flex items-center justify-center aspect-square hover:bg-white/15 transition-all"
                >
                  <GiLaurelsTrophy className="w-12 h-12 text-yellow-400" />
                </div>
              ))}
            </div>
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
                    <div className="relative">
                      <div className="flex items-center gap-2 bg-[#14181C] rounded-lg p-2 border border-white/5">
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
                      
                      {/* Duplicate Error Popup */}
                      {duplicateError && (
                        <div className="absolute z-50 text-center w-full mt-2 bg-red-500 border border-red-700 rounded-lg shadow-xl p-3 text-sm text-white animate-in fade-in duration-200">
                          {duplicateError}
                        </div>
                      )}
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

        {/* Quick Actions */}
        <h2 className="text-lg font-bold mb-1">QUICK ACTIONS</h2>
        <div className="w-full h-px bg-white/50 mb-3"></div>
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
