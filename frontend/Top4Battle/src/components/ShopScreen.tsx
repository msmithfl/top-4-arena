import React, { useState } from 'react';
import type { MovieCard } from '../types';
import { fetchPopularMovies } from '../utils/tmdbApi';
import { enhanceMovie } from '../utils/enhanceMovie';
import PlayerCard from './MovieCard';
import DeckPopup from './DeckPopup';

interface ShopScreenProps {
  onPick: (card: MovieCard) => void;
  deck: MovieCard[];
  usedCardIds: number[];
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onPick, deck, usedCardIds }) => {
  const [shopCards, setShopCards] = useState<MovieCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerolled, setRerolled] = useState(false);
  const hasFetched = React.useRef(false);

  const rerollShopCards = async () => {
    setLoading(true);
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const movies = await fetchPopularMovies(randomPage);
    const cards = movies.slice(0, 3).map(enhanceMovie);
    setShopCards(cards);
    setLoading(false);
    setRerolled(true);
  };

  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const getShopCards = async () => {
      setLoading(true);
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const movies = await fetchPopularMovies(randomPage);
      const cards = movies.slice(0, 3).map(enhanceMovie);
      setShopCards(cards);
      setLoading(false);
    };
    getShopCards();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-900 rounded-lg max-w-2xl w-full border-4 border-yellow-500 shadow-2xl p-8 text-center flex flex-col"
        style={{ minHeight: '520px' }} // Ensures consistent popup height
      >
        <div className='flex justify-between mb-5'>
          <button
            onClick={rerollShopCards}
            disabled={rerolled || loading}
            className={`bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all ${rerolled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Reroll Cards
          </button>
          <DeckPopup deck={deck} usedCardIds={usedCardIds} />
        </div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Shop: Choose a Card</h2>
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="text-white text-xl w-full">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {shopCards.map(card => (
                <div key={card.id} className="flex flex-col items-center">
                  <PlayerCard
                    card={card}
                    isSelected={false}
                    onSelect={() => onPick(card)}
                  />
                  <button
                    onClick={() => onPick(card)}
                    className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg"
                  >
                    Add to Deck
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;