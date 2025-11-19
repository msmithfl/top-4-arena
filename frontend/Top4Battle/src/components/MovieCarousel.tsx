import React, { useState, useEffect } from 'react';
//import { Sword, Shield } from 'lucide-react';
import { fetchPopularMovies } from '../utils/tmdbApi';

interface PosterData {
  url: string;
  attack: number;
  defense: number;
}

const MovieCarousel: React.FC = () => {
  const [posters, setPosters] = useState<PosterData[]>([]);

  useEffect(() => {
    const loadPosters = async () => {
      try {
        const movies = await fetchPopularMovies(Math.floor(Math.random() * 100) + 1);
        const posterData = movies
          .slice(0, 20)
          .filter(m => m.poster_path)
          .map(m => ({
            url: `https://image.tmdb.org/t/p/w300${m.poster_path}`,
            attack: Math.floor(Math.random() * 50) + 10, // Random 10-59
            defense: Math.floor(Math.random() * 50) + 10  // Random 10-59
          }));
        // Duplicate the posters for seamless infinite scroll
        setPosters([...posterData, ...posterData]);
      } catch (err) {
        console.error('Failed to load carousel posters:', err);
      }
    };
    loadPosters();
  }, []);

  if (posters.length === 0) {
    return null;
  }

  return (
    <div className="w-screen overflow-hidden py-8 pb-16">
      <div className="flex animate-scroll">
        {posters.map((poster, idx) => (
          <div
            key={idx}
            className="shrink-0 mx-2 relative"
            style={{ width: '150px', height: '225px' }}
          >
            <img
              src={poster.url}
              alt={`Movie poster ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            {/* Attack - Top Left */}
            {/* <div className="absolute top-1 left-1 bg-black bg-opacity-75 rounded px-2 py-1 flex items-center gap-1">
              <Sword className="w-3 h-3 text-red-400" />
              <p className="text-xs font-bold text-yellow-400">{poster.attack}</p>
            </div> */}
            {/* Defense - Top Right */}
            {/* <div className="absolute top-1 right-1 bg-black bg-opacity-75 rounded px-2 py-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-400" />
              <p className="text-xs font-bold text-gray-300">{poster.defense}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
