import React, { useState } from 'react';
import { fetchMovieDetails, fetchPopularMovies } from '../utils/tmdbApi';
import { Film, Shuffle, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODZmYTE3MzcwNzRmMzY3NzkwNzc1Y2Q1NTQwNmExYyIsIm5iZiI6MTY4NzYyNzAzOC40MDEsInN1YiI6IjY0OTcyNTFlYjM0NDA5MDBhZDUyNTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YA8K57yrPNiM_UwefPB6Bv2t8fZdY_v1GD9AS3rRrU0';

interface PickTopFilmsProps {
  onComplete: (movies: any[]) => void;
}

const PickTopFilms: React.FC<PickTopFilmsProps> = ({ onComplete }) => {
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const handleFind = async () => {
    if (!search || picked.length >= 4) return;
    setLoading(true);
    setError(null);
    setDuplicateError(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`
          }
        }
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError('No results found. Please check spelling.');
      } else {
        const movie = await fetchMovieDetails(data.results[0].id);
        // Prevent duplicate selection by TMDB id
        if (picked.some(m => m.id === movie.id)) {
          setDuplicateError('You already picked this movie!');
        } else {
          setPicked([...picked, movie]);
          setSearch('');
        }
      }
    } catch (err) {
      setError('Failed to search. Try again.');
    }
    setLoading(false);
  };

  // Add this function to pick 4 random movies
  const handleRandomPick = async () => {
    setLoading(true);
    setError(null);
    setDuplicateError(null);
    try {
        // Calculate how many empty slots we need to fill
        const emptySlots = 4 - picked.length;
        
        if (emptySlots === 0) {
        setLoading(false);
        return;
        }
        
        // Pick a random page and get movies
        const randomPage = Math.floor(Math.random() * 100) + 1;
        const movies = await fetchPopularMovies(randomPage);
        
        // Filter out any movies already picked (by id)
        const pickedIds = new Set(picked.map(m => m.id));
        const availableMovies = movies.filter(m => !pickedIds.has(m.id));
        
        // Shuffle and pick the number we need
        const shuffled = availableMovies.sort(() => Math.random() - 0.5).slice(0, emptySlots);
        
        // Fetch full details for each
        const details = await Promise.all(shuffled.map(m => fetchMovieDetails(m.id)));
        
        // Add to existing picked movies
        setPicked([...picked, ...details]);
        setSearch('');
    } catch (err) {
        setError('Failed to pick random movies.');
    }
    setLoading(false);
    };

  const handleRemove = (idx: number) => {
    setPicked(picked.filter((_, i) => i !== idx));
  };

  const handleStart = () => {
    if (picked.length === 4) onComplete(picked);
  };

    {error && <div className="text-red-400 mb-2 text-center">{error}</div>}
    {duplicateError && <div className="text-yellow-400 mb-2 text-center">{duplicateError}</div>}

    return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center space-y-8 bg-white/5 backdrop-blur-sm p-8 rounded-lg border border-white/10 shadow-2xl relative">
        {/* Back button moved to top left inside the film section */}
        <div className="absolute left-4 top-4 hover:scale-105 transition-all">
            <Link
            to='/'
            className='flex items-center text-2xl gap-2'
            >
            <span><ArrowLeft /></span>Back
            </Link>
        </div>
        <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-linear-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            Pick Your Top 4 Films
            </h2>
            <p className="text-xl text-gray-300">Search for your top 4 and add them to your deck!</p>
        </div>
        {/* ...rest of your component unchanged... */}
        <div className="flex gap-2 max-w-lg mx-auto mb-6">
            <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type a film title"
            className="flex-1 p-3 rounded bg-gray-800 text-lg text-white"
            disabled={loading || picked.length >= 4}
            />
            <button
            onClick={handleFind}
            disabled={loading || !search || picked.length >= 4}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-lg text-white cursor-pointer"
            >
            {loading ? 'Searching...' : 'Find'}
            </button>
        </div>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        <div className="grid grid-cols-4 gap-4 mb-6 justify-items-center items-center">
            {[0, 1, 2, 3].map(idx => (
            <div
                key={idx}
                className="bg-gray-800 rounded-lg p-2 flex flex-col items-center justify-center"
                style={{ minHeight: '210px', minWidth: '110px', height: '210px', width: '110px' }}
            >
                {picked[idx] ? (
                <>
                    <div className="relative w-full h-44 mb-2 flex items-center justify-center">
                    <img
                        src={picked[idx].poster_path ? `https://image.tmdb.org/t/p/w200${picked[idx].poster_path}` : ''}
                        alt={picked[idx].title}
                        className="w-full h-40 object-cover rounded shadow-lg"
                    />
                    <button
                        onClick={() => handleRemove(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-90 transition cursor-pointer"
                        aria-label="Remove"
                    >
                        <X className="w-5 h-5 text-red-400" />
                    </button>
                    </div>
                    <div className="text-center text-sm font-bold text-purple-200 truncate w-full mt-1">{picked[idx].title}</div>
                </>
                ) : (
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <Film className="w-8 h-8 text-purple-700 mb-2" />
                    <span className="text-gray-500">Empty</span>
                </div>
                )}
            </div>
            ))}
        </div>
        <div>
            <button
            onClick={handleStart}
            disabled={picked.length !== 4}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-bold text-xl w-full transition-all text-white shadow-lg cursor-pointer"
            >
            Start Game
            </button>
            <button
                onClick={handleRandomPick}
                disabled={loading || picked.length === 4}
                className="bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-full font-bold text-xl w-full mt-2 flex items-center justify-center gap-2 transition-all text-white shadow-lg cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                <Shuffle className="w-5 h-5" />
                {picked.length === 0 
                    ? 'Randomly Pick 4 Movies' 
                    : `Fill ${4 - picked.length} Empty Slot${4 - picked.length !== 1 ? 's' : ''} Randomly`
                }
            </button>
        </div>
        </div>
    </div>
    );
};

export default PickTopFilms;