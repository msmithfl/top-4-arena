import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Layers, Sword, Shield, ArrowUp } from 'lucide-react';
import type { MovieCard } from '../types';
import MovieCardComponent from './MovieCard';

interface DeckPopupProps {
  deck: MovieCard[];
  discardPile: MovieCard[];
}

const DeckPopup: React.FC<DeckPopupProps> = ({ deck, discardPile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<MovieCard | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<'rating' | 'runtime' | 'release' | 'genres' | null>(null);

  // Calculate genre counts (only first 2 genres per film)
  const genreCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    deck.forEach(card => {
      if (Array.isArray(card.genres)) {
        card.genres.slice(0, 2).forEach(genre => {
          counts[genre.name] = (counts[genre.name] || 0) + 1;
        });
      }
    });
    // Sort by count descending
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [deck]);

  const modalContent = isOpen ? (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-[#2C3033] backdrop-blur-sm rounded-lg max-w-4/5 min-h-11/12 max-h-[90vh] border border-white/10 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarColor: "#3b82f6 #1e293b",
          scrollbarWidth: "auto"
        }}
      >
        <div className="flex gap-6 px-8 pb-8 pt-8 flex-1 overflow-hidden">
          {/* Genre Overview Section */}
          <div className="w-56 shrink-0">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Layers className="w-6 h-6" />
              Deck Overview
            </h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                {genreCounts.filter(([, count]) => count > 1).map(([genre, count]) => (
                  <div key={genre} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{genre === 'Science Fiction' ? 'Sci-Fi' : genre}</span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 [@media(min-width:1600px)]:grid-cols-6 gap-2 flex-1 overflow-y-auto content-start px-2 pb-2 pt-4">
            {deck.map(card => (
            <div 
              key={card.id} 
              className={`relative text-white cursor-pointer flex items-center justify-center ${
                selectedCard?.id === card.id ? 'z-20' : 'z-0'
              }`}
              onClick={() => {
                setSelectedCard(card);
                setShowDescription(false);
              }}
            >
              <MovieCardComponent
                card={card}
                isSelected={selectedCard?.id === card.id}
                onSelect={() => {}}
                isDisabled={true}
                small={true}
              />
              {discardPile.some(discarded => discarded.id === card.id) && (
                <div className={`absolute inset-0 bg-gray-900/80 rounded-lg z-10 flex items-center justify-center pointer-events-none transition-all transform ${
                  selectedCard?.id === card.id ? 'scale-105 -translate-y-2' : ''
                }`}>
                    <span className="text-white text-xs font-bold"></span>
                </div>
              )}
            </div>
          ))}
          </div>

          {/* Card Detail Section */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <div className="overflow-y-auto overflow-x-visible max-h-[calc(90vh-12rem)]">
              {selectedCard ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 overflow-visible">
                  {/* Poster */}
                  {/* Fix poster size by height to avoid size shifting on y */}
                  <div className="mb-3 relative cursor-pointer [@media(max-height:750px)]:max-w-40 [@media(max-height:800px)]:max-w-44 [@media(max-height:800px)]:mx-auto" onClick={() => setShowDescription(!showDescription)}>
                    <img 
                      src={`https://image.tmdb.org/t/p/w300${selectedCard.poster_path}`}
                      alt={selectedCard.title}
                      className="w-full rounded-lg"
                    />
                    
                    {showDescription && (
                      <div className="absolute inset-0 bg-black/80 rounded-lg p-2 flex items-center justify-center">
                        <p className="text-white text-sm leading-relaxed overflow-y-auto max-h-full">
                          {selectedCard.overview || 'No description available.'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-lg font-bold text-white mb-1.5 text-center">
                    {selectedCard.title}
                  </h4>
                  
                  {/* Genres */}
                  <div className="mb-3 relative">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {selectedCard.genres.slice(0, 2).map(genre => (
                        <span 
                          key={genre.id} 
                          className="text-xs px-2 py-1 bg-blue-600 rounded font-semibold text-white cursor-pointer"
                          onMouseEnter={() => setHoveredStat('genres')}
                          onMouseLeave={() => setHoveredStat(null)}
                        >
                          {genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name}
                        </span>
                      ))}
                    </div>
                    {hoveredStat === 'genres' && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-2 bg-black/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl pointer-events-none">
                        <p className="text-gray-300 text-xs leading-relaxed">
                          Genres are used to create <span className="text-green-400 font-bold">SYNERGIES</span>, which multiply your damage.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-1.5">
                    <div 
                      className="flex justify-between items-center text-sm cursor-pointer relative"
                      onMouseEnter={() => setHoveredStat('rating')}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-bold">{(selectedCard.basePower / 100).toFixed(1)}</span>
                        <Sword className='w-4 h-4 text-red-400' />
                      </div>
                      {hoveredStat === 'rating' && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-2 bg-black/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl pointer-events-none">
                          <p className="text-gray-300 text-xs leading-relaxed">
                            Your <span className="text-red-400 font-bold">ATTACK</span> is based on the film's TMDB (The Movie Database) rating.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="flex justify-between items-center text-sm cursor-pointer relative"
                      onMouseEnter={() => setHoveredStat('runtime')}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <span className="text-gray-400">Runtime:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400 font-bold">{selectedCard.runtime}m</span>
                        <Shield className='w-4 h-4 text-blue-400' />
                      </div>
                      {hoveredStat === 'runtime' && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-2 bg-black/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl pointer-events-none">
                          <p className="text-gray-300 text-xs leading-relaxed">
                            Your <span className="text-blue-400 font-bold">DEFENSE</span> is based on the film's runtime in minutes.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="flex justify-between items-center text-sm cursor-pointer relative"
                      onMouseEnter={() => setHoveredStat('release')}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <span className="text-gray-400">Release:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-green-400 font-bold">{selectedCard.release_date.split('-')[0]}</span>
                        <ArrowUp className='w-4 h-4 text-green-400' />
                      </div>
                      {hoveredStat === 'release' && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-2 bg-black/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl pointer-events-none">
                          <p className="text-gray-300 text-xs leading-relaxed">
                            Release dates are used to create <span className="text-green-400 font-bold">SYNERGIES</span>, which multiply your damage.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-full flex items-center justify-center">
                  <p className="text-gray-400 text-center">Click a card to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-full text-xl transition-all cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer"
      >
        <Layers className="w-7 h-7 hover:scale-110 transition-all" />
      </button>
      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
};

export default DeckPopup;