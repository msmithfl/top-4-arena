import React, { useEffect, useState } from 'react';
import type { MovieCard } from '../types';
import { fetchMovieDetails, fetchPopularMovies } from '../utils/tmdbApi';
import { enhanceMovie } from '../utils/enhanceMovie';
import PlayerCard from './MovieCard';
import { GiTicket } from "react-icons/gi";
import spinnerImg from '../assets/imgs/top4-spinner.png';

interface ShopScreenProps {
  deck: MovieCard[];
  discardPile: MovieCard[];
  round: number;
  existingCardIds?: Set<number>;
  tickets: number;
  onShopAction: (updatedDeck: MovieCard[]) => void;
}

type ShopAction = 'new-card' | 'upgrade' | 'augment' | null;

const ShopScreen: React.FC<ShopScreenProps> = ({ deck, round, existingCardIds, tickets, onShopAction }) => {
  const [shopCards, setShopCards] = useState<MovieCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ShopAction>(null);
  const [selectedCard, setSelectedCard] = useState<MovieCard | null>(null);
  const [actionComplete, setActionComplete] = useState(false);
  const hasFetched = React.useRef(false);
  
  // Build set of existing card IDs from deck and provided set
  const excludeIds = React.useMemo(() => {
    const ids = new Set(deck.map(card => card.id));
    if (existingCardIds) {
      existingCardIds.forEach(id => ids.add(id));
    }
    return ids;
  }, [deck, existingCardIds]);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  const getShopCards = async () => {
    setLoading(true);
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const movies = await fetchPopularMovies(randomPage);
    // Filter out duplicates and fetch details for the 3 shop cards
    const uniqueMovies = movies.filter(m => !excludeIds.has(m.id));
    const cards = await Promise.all(
      uniqueMovies.slice(0, 3).map(async m => {
        const detail = await fetchMovieDetails(m.id);
        return enhanceMovie(detail);
      })
    );
    setShopCards(cards);
    setLoading(false);
  };
  getShopCards();
}, [excludeIds]);

  const handleActionSelect = (action: ShopAction) => {
    setSelectedAction(action);
    setSelectedCard(null);
  };

  const [updatedDeck, setUpdatedDeck] = useState<MovieCard[]>([]);

  const handleCardSelect = (card: MovieCard) => {
    if (!selectedAction || actionComplete) return;
    if (selectedAction !== 'new-card' && (selectedAction === 'upgrade' || selectedAction === 'augment')) {
      // For upgrade/augment, only allow clicking deck cards
    } else if (selectedAction === 'new-card') {
      // For new-card, only allow clicking shop cards
    }
    
    let newDeck = [...deck];
    
    if (selectedAction === 'new-card') {
      // Add new card to deck
      newDeck.push(card);
    } else if (selectedAction === 'upgrade') {
      // Upgrade card - increase basePower by 200 (2.0 rating) and baseDefense by 50
      const cardIndex = newDeck.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        newDeck[cardIndex] = {
          ...newDeck[cardIndex],
          basePower: newDeck[cardIndex].basePower + 200,
          baseDefense: newDeck[cardIndex].baseDefense + 50
        };
      }
    } else if (selectedAction === 'augment') {
      // For now, just mark as complete - will implement genre change UI later
      // This would need a genre selection step
      alert('Augment feature coming soon!');
      return;
    }
    
    setUpdatedDeck(newDeck);
    setSelectedCard(card);
    setActionComplete(true);
  };

  const handleContinue = () => {
    if (actionComplete && updatedDeck.length > 0) {
      onShopAction(updatedDeck); // Pass updated deck
    }
  };

  // Display current ticket count (decremented if action is selected)
  const displayTickets = selectedAction ? tickets - 1 : tickets;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#2C3033] rounded-lg max-w-3/4 w-full border border-white/10 shadow-2xl p-8 flex flex-col" 
        style={{ 
          maxHeight: '90vh',
          scrollbarColor: "#3b82f6 #1e293b",
          scrollbarWidth: "auto"
        }}
      >
        {/* Header */}
        <div className='flex justify-start items-center mb-6'>
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-white">Ticket Booth</h2>
            <div className="bg-yellow-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <GiTicket className='w-7 h-7' />
              <span className="text-white font-bold text-xl"> {displayTickets}</span>
            </div>
          </div>
          {/* <DeckPopup deck={deck} discardPile={discardPile} /> */}
        </div>

        {/* Main Content */}
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Genre Overview Section */}
          <div className="w-56 shrink-0 min-w-0">
            {/* <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              Deck Overview
            </h3> */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-5 border border-white/10">
              <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                {React.useMemo(() => {
                  const counts: { [key: string]: number } = {};
                  (updatedDeck.length > 0 ? updatedDeck : deck).forEach(card => {
                    if (Array.isArray(card.genres)) {
                      card.genres.slice(0, 2).forEach(genre => {
                        counts[genre.name] = (counts[genre.name] || 0) + 1;
                      });
                    }
                  });
                  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
                }, [updatedDeck, deck]).filter(([, count]) => count > 1).map(([genre, count]) => (
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

          {/* Deck Cards */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="grid grid-cols-4 gap-2">
              {(updatedDeck.length > 0 ? updatedDeck : deck).map(card => (
                <div 
                  key={card.id} 
                  onClick={() => {
                    // Only allow clicking deck cards for upgrade/augment actions
                    if (selectedAction === 'upgrade' || selectedAction === 'augment') {
                      handleCardSelect(card);
                    }
                  }} 
                  className={(selectedAction === 'upgrade' || selectedAction === 'augment') && !actionComplete ? "cursor-pointer" : "cursor-default"}
                >
                  <PlayerCard
                    card={card}
                    isSelected={selectedCard?.id === card.id}
                    onSelect={() => {}}
                    small={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex-1 space-y-4 shrink-0 flex flex-col mx-4">
            {/* Top Section - Upgrade and Augment */}
            <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className='flex gap-4 mb-4'>
                <button
                  onClick={() => handleActionSelect('upgrade')}
                  disabled={tickets < 1 || selectedAction !== null}
                  className={`w-full p-4 rounded-lg font-bold text-lg transition-all cursor-pointer ${
                    selectedAction === 'upgrade'
                      ? 'bg-green-600 text-white ring-4 ring-green-400'
                      : tickets < 1 || selectedAction !== null
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Level Up Movie
                </button>

                <button
                  onClick={() => handleActionSelect('augment')}
                  disabled={true}
                  className={`w-full p-4 rounded-lg font-bold text-lg transition-all cursor-not-allowed bg-gray-600 text-gray-400`}
                >
                  Genre Shifter (Coming Soon)
                </button>

              </div>

              {/* Feedback Section */}
              {selectedAction === 'upgrade' && (
                <div className="flex-1 bg-black/30 rounded-lg p-4 flex items-center justify-center">
                  {!actionComplete ? (
                    <p className="text-gray-300 text-center">
                      Choose a card to upgrade <span className="text-red-400 font-bold">ATTACK</span> and <span className="text-blue-400 font-bold">DEFENSE</span>
                    </p>
                  ) : selectedCard && (
                    <div className="text-center">
                      <p className="text-white text-lg mb-2">
                        <span className="font-bold text-green-400">{selectedCard.title}</span> was upgraded!
                      </p>
                      <p className="text-gray-300">
                        Attack: <span className="text-red-400">{(selectedCard.basePower / 100).toFixed(1)}</span> → <span className="text-red-400 font-bold">{((selectedCard.basePower + 200) / 100).toFixed(1)}</span>
                      </p>
                      <p className="text-gray-300 mt-1">
                        Defense: <span className="text-blue-400">{selectedCard.baseDefense}</span> → <span className="text-blue-400 font-bold">{selectedCard.baseDefense + 50}</span>
                      </p>
                      <p className="text-orange-400 font-bold mt-4">Continue to the next round</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Section - Add New Card */}
            <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              {selectedAction !== 'new-card' && (
                <button
                  onClick={() => handleActionSelect('new-card')}
                  disabled={tickets < 1 || selectedAction !== null}
                  className={`w-full p-4 rounded-lg font-bold text-lg transition-all cursor-pointer ${
                    tickets < 1 || selectedAction !== null
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Get New Movie
                </button>
              )}

              {selectedAction === 'new-card' && (
                <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
                  {loading ? (
                    <div className="text-center">
                      <img 
                        src={spinnerImg} 
                        alt="Loading" 
                        className="w-16 h-16 animate-spin mx-auto mb-2" 
                      />
                      <p className="text-white text-sm">Loading...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {shopCards.map(card => (
                        <div key={card.id} onClick={() => handleCardSelect(card)} className="cursor-pointer">
                          <PlayerCard
                            card={card}
                            isSelected={selectedCard?.id === card.id}
                            onSelect={() => {}}
                            small={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Continue Button */}
        <div className="mt-6">
          <button
            onClick={handleContinue}
            disabled={!actionComplete}
            className={`w-full font-bold px-8 py-4 rounded-full text-xl transition-all ${
              actionComplete
                ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Round {round + 1}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShopScreen;