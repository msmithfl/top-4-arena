import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import type { MovieCard } from '../types';
import MovieCardComponent from './MovieCard';

interface DeckPopupProps {
  deck: MovieCard[];
  usedCardIds: number[];
}

const DeckPopup: React.FC<DeckPopupProps> = ({ deck, usedCardIds }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
      >
        <Layers className="w-5 h-5" />
        View Deck
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-blue-500 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <X className="w-7 h-7" />
            </button>
            <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-2 justify-center mt-8 mb-6">
              <Layers className="w-8 h-8" />
              Your Deck
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8 pb-8">
              {deck.map(card => (
                <div key={card.id} className="relative">
                  <MovieCardComponent
                    card={card}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                  {usedCardIds.includes(card.id) && (
                    <div className="absolute inset-0 bg-gray-900/80 hover:scale-105 rounded-lg z-10 flex items-center justify-center">
                        <span className="text-white text-xs font-bold"></span>
                    </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeckPopup;