import React from 'react';
import { Sword, Shield, Heart, Laugh, Ghost, Drama, Film, Globe, Music, Swords, Scale } from 'lucide-react';
import { GiMountainRoad, GiMagnifyingGlass, GiAtom, GiTv, GiCowboyBoot, GiPistolGun, GiDrippingKnife } from "react-icons/gi";
import { MdDraw } from "react-icons/md";
import { MdFamilyRestroom } from "react-icons/md";
import { FaHatWizard } from "react-icons/fa";
import type { MovieCard } from '../types';

interface MovieCardProps {
  card: MovieCard;
  isSelected: boolean;
  onSelect: (cardId: number) => void;
  isDisabled?: boolean;
  small?: boolean;
  useGenreIcons?: boolean;
}

// Genre icon mapping
const genreIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Action': GiPistolGun,
  'Adventure': GiMountainRoad,
  'Animation': MdDraw,
  'Comedy': Laugh,
  'Crime': Scale,
  'Documentary': Film,
  'Drama': Drama,
  'Family': MdFamilyRestroom,
  'Fantasy': FaHatWizard,
  'History': Globe,
  'Horror': Ghost,
  'Music': Music,
  'Mystery': GiMagnifyingGlass,
  'Romance': Heart,
  'Science Fiction': GiAtom,
  'TV Movie': GiTv,
  'Thriller': GiDrippingKnife,
  'War': Swords,
  'Western': GiCowboyBoot,
};

const MovieCardComponent: React.FC<MovieCardProps> = ({ card, isSelected, onSelect, isDisabled = false, small = false, useGenreIcons = false }) => {
  const genres = Array.isArray(card.genres) ? card.genres.slice(0, 2) : [];

  const getGenreDisplay = (genreName: string) => {
    const displayName = genreName === 'Science Fiction' ? 'Sci-Fi' : genreName;
    if (useGenreIcons) {
      const IconComponent = genreIconMap[genreName];
      return IconComponent ? <IconComponent className="w-5 h-5" /> : displayName;
    }
    return displayName;
  };

  return (
    <div
      onClick={() => onSelect(card.id)}
      className={`transition-all transform ${
        isDisabled ? 'cursor-default' : 'cursor-pointer hover:scale-105'
      } ${
        isSelected ? 'scale-105 -translate-y-2' : ''
      }`}
    >
      <div className={`relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 aspect-2/3 w-full ${
        isSelected ? 'border-yellow-400' : 'border-gray-700'
      }`}>
        {/* Poster as full background */}
        <img 
          src={`https://image.tmdb.org/t/p/w300${card.poster_path}`}
          alt={card.title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating - Top Left */}
        <div className={`absolute top-1 left-1 bg-black bg-opacity-75 rounded flex items-center gap-1 ${
          small ? 'px-1 py-0' : 'px-2 py-1'
        }`}>
          <Sword className="w-3 h-3 text-red-400" />
          <p className="text-xs font-bold text-yellow-400">{(card.basePower / 100)?.toFixed(1) ?? '--'}</p>
        </div>
        
        {/* Runtime - Top Right */}
        <div className={`absolute top-1 right-1 bg-black bg-opacity-75 rounded flex items-center gap-1 ${
          small ? 'px-1 py-0' : 'px-2 py-1'
        }`}>
          <Shield className="w-3 h-3 text-blue-400" />
          <p className="text-xs font-bold text-gray-300">{card.runtime ? `${card.runtime}` : '--'}</p>
        </div>
        
        {/* Genres - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-2">
          <div className="flex gap-1 justify-center flex-nowrap">
            {genres.length > 0 ? (
              genres.map(g => (
                <span key={g.id} className={`bg-blue-600 bg-opacity-90 rounded font-semibold whitespace-nowrap flex items-center justify-center ${
                  small ? 'px-1 py-0 text-[10px] [@media(min-width:1800px)]:text-xs' : 'px-2 py-1 text-xs'
                }`}>
                  {getGenreDisplay(g.name)}
                </span>
              ))
            ) : (
              <span className={`text-xs bg-gray-700 bg-opacity-90 rounded font-semibold whitespace-nowrap ${
                small ? 'px-1 py-0' : 'px-2 py-1'
              }`}>
                No genres
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardComponent;
