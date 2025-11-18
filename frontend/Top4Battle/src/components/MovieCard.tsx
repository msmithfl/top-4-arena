import React from 'react';
import { Sword, Shield } from 'lucide-react';
import type { MovieCard } from '../types';

interface MovieCardProps {
  card: MovieCard;
  isSelected: boolean;
  onSelect: (cardId: number) => void;
  highlightSynergy?: boolean;
}

const MovieCardComponent: React.FC<MovieCardProps> = ({ card, isSelected, onSelect, highlightSynergy }) => {
  return (
    <div
      onClick={() => onSelect(card.id)}
      className={`cursor-pointer transition-all transform hover:scale-105 ${
        isSelected
          ? 'ring-4 ring-yellow-400 scale-105 -translate-y-2'
          : highlightSynergy
          ? 'ring-4 ring-blue-400 scale-105'
          : ''
      }`}
    >
      <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700 aspect-2/3 w-full">
        {/* Poster as full background */}
        <img 
          src={`https://image.tmdb.org/t/p/w300${card.poster_path}`}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating - Top Left */}
        <div className="absolute top-1 left-1 bg-black bg-opacity-75 rounded px-2 py-1 flex items-center gap-1">
          <Sword className="w-3 h-3 text-red-400" />
          <p className="text-xs font-bold text-yellow-400">{card.vote_average.toFixed(1)}</p>
        </div>
        
        {/* Runtime - Top Right */}
        <div className="absolute top-1 right-1 bg-black bg-opacity-75 rounded px-2 py-1 flex items-center gap-1">
          <Shield className="w-3 h-3 text-blue-400" />
          <p className="text-xs font-bold text-gray-300">{card.runtime}m</p>
        </div>
        
        {/* Genres - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-2">
          <div className="flex gap-1 justify-center">
            {card.genres.slice(0, 2).map(g => (
              <span key={g.id} className="text-xs px-2 py-1 bg-blue-600 bg-opacity-90 rounded font-semibold">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardComponent;