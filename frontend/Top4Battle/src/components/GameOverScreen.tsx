import React from 'react';
import type { MovieCard, BossCard } from '../types';

interface GameOverScreenProps {
  round: number;
  boss: BossCard;
  collectionDeck: MovieCard[];
  gameStats: {
    cardPlayCount: Record<number, number>;
    totalCardsPlayed: number;
    cardsUpgraded: number;
    totalTicketsEarned: number;
    bestHand: { cards: MovieCard[], score: number };
    genrePlayCount: Record<string, number>; //not implemented
    defeatedBy: string | null;
  };
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ round, boss, collectionDeck, gameStats }) => {
  // Calculate most played card
  const mostPlayedCardId = Object.entries(gameStats.cardPlayCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
  const mostPlayedCard = mostPlayedCardId 
    ? collectionDeck.find(c => c.id === parseInt(mostPlayedCardId))
    : null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-[#2C3033] rounded-lg border border-red-500/50 shadow-2xl p-4 max-h-[90vh] overflow-y-auto w-auto max-w-[90vw]"
        style={{
          scrollbarColor: "#3b82f6 #1e293b",
          scrollbarWidth: "auto"
        }}
      >
        <div className="flex items-center gap-2 justify-center text-center mb-3">
          <h2 className="text-5xl font-bold text-red-500">DEFEATED!</h2>
          <p className="text-xl text-gray-300">You made it to <span className="font-bold text-blue-400">Round {round}</span></p>
        </div>

        <div className="space-y-4">
          {/* Best Hand */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10">
            <h3 className="text-lg font-bold text-gray-300 mb-2">Strongest Top 4 - {gameStats.bestHand.score.toLocaleString()} Damage</h3>
            {gameStats.bestHand.cards.length > 0 ? (
              <div className="flex gap-2 justify-center">
                {gameStats.bestHand.cards.map(card => (
                  <div key={card.id}>
                    <img 
                      src={`https://image.tmdb.org/t/p/w185${card.poster_path}`}
                      alt={card.title}
                      className="w-30 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No cards played</p>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="flex gap-4">
            {/* Left Column - Stats */}
            <div className="flex flex-col gap-4 shrink-0">
              {/* Cards Played */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-300">Cards Played</h3>
                <h3 className="text-lg font-bold text-white">{gameStats.totalCardsPlayed}</h3>
              </div>

              {/* Cards Upgraded */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-300">Cards Upgraded</h3>
                <h3 className="text-lg font-bold text-white">{gameStats.cardsUpgraded}</h3>
              </div>

              {/* Tickets Earned */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-300">Tickets Earned</h3>
                <h3 className="text-lg font-bold text-white">{gameStats.totalTicketsEarned}</h3>
              </div>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex-1 cursor-pointer hover:scale-105 transition-all bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-4 rounded-lg font-bold text-xl"
              >
                Back to Home
              </button>
            </div>

            {/* Right Column - Most Played Card & Defeated By */}
            <div className="space-y-4 flex-1 max-w-96">
              {/* Most Played Card */}
              {mostPlayedCard && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-300 mb-2">Most Played Card</h3>
                      <p className="text-xl font-bold text-white">{mostPlayedCard.title}</p>
                      <p className="text-sm text-gray-400">{gameStats.cardPlayCount[mostPlayedCard.id]} times</p>
                    </div>
                    <img 
                      src={`https://image.tmdb.org/t/p/w185${mostPlayedCard.poster_path}`}
                      alt={mostPlayedCard.title}
                      className="w-20 rounded shadow-lg"
                    />
                  </div>
                </div>
              )}

              {/* Defeated By */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 px-4 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-300 mb-2">Defeated By</h3>
                    <p className="text-2xl font-bold text-white">{gameStats.defeatedBy}</p>
                  </div>
                  {boss && (
                    <img 
                      src={`https://image.tmdb.org/t/p/w185${boss.poster_path}`}
                      alt={boss.title}
                      className="w-20 rounded shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
