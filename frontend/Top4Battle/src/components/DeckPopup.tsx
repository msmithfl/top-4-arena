import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Layers } from 'lucide-react';
import type { MovieCard } from '../types';
import MovieCardComponent from './MovieCard';

interface DeckPopupProps {
  deck: MovieCard[];
  discardPile: MovieCard[];
}

const DeckPopup: React.FC<DeckPopupProps> = ({ deck, discardPile }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        className="bg-[#2C3033] backdrop-blur-sm rounded-lg max-w-4/5 min-h-10/12 max-h-[90vh] border border-white/10 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          scrollbarColor: "#3b82f6 #1e293b",
          scrollbarWidth: "auto"
        }}
      >
        <div className="flex gap-6 px-20 pb-8 pt-8 flex-1 overflow-hidden">
          {/* Genre Overview Section */}
          <div className="w-64 shrink-0">
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
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 flex-1 overflow-y-auto content-start">
            {deck.map(card => (
            <div key={card.id} className="relative text-white">
              <MovieCardComponent
                card={card}
                isSelected={false}
                onSelect={() => {}}
                isDisabled={true}
              />
              {discardPile.some(discarded => discarded.id === card.id) && (
                <div className="absolute inset-0 bg-gray-900/80 rounded-lg z-10 flex items-center justify-center">
                    <span className="text-white text-xs font-bold"></span>
                </div>
              )}
            </div>
          ))}
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