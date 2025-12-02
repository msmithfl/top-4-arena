import React from 'react';
import { Heart } from 'lucide-react';
import type { MovieCard, BossCard, BattleResult } from '../types';

interface MobileGameInfoProps {
  selectedCards: number[];
  hand: MovieCard[];
  boss: BossCard | null;
  calculateBattle: (cards: MovieCard[]) => BattleResult;
  playerHP: number;
  maxPlayerHP: number;
}

const MobileGameInfo: React.FC<MobileGameInfoProps> = ({
  selectedCards,
  hand,
  boss,
  calculateBattle,
  playerHP,
  maxPlayerHP
}) => {
  const playedCards = hand.filter(card => selectedCards.includes(card.id));
  const result = selectedCards.length > 0 ? calculateBattle(playedCards) : null;

  let damage = result ? result.damage : 0;
  if (boss && result) {
    if (boss.ability.name === 'EMOTIONAL WEIGHT') {
      damage = Math.round(damage * 0.7);
    }
    if (boss.ability.name === 'TECH SHIELD') {
      damage = Math.max(0, damage - 1500);
    }
  }

  const defense = result ? result.defense : 0;
  const synergies = result ? result.synergies : [];
  
  // Truncate synergy text for mobile display
  const truncateSynergy = (synergy: string): string => {
    // Extract genre name and multiplier from format like "Action Combo\n 1.2x damage"
    const parts = synergy.split('\n');
    let genreName = parts[0].replace(' Combo', '');
    // Map Science Fiction to Sci-Fi
    if (genreName === 'Science Fiction') {
      genreName = 'Sci-Fi';
    }
    const multiplier = parts[1]?.trim().split(' ')[0] || ''; // Extract "3x", "2x", "1.2x"
    return `${genreName} ${multiplier}`;
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 items-stretch">
        {/* Left: ATK and DEF side by side */}
        <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-1 rounded-lg border-2 border-orange-500 h-[68px]">
          <div className="flex items-center justify-around h-full">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-300">ATK</span>
              <span className="text-2xl font-bold text-red-400">
                {selectedCards.length > 0 ? damage : '0'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-300">DEF</span>
              <span className="text-2xl font-bold text-blue-400">
                {selectedCards.length > 0 ? defense : '0'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right: Synergies 2x2 grid - Fixed size container */}
        <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-2 rounded-lg border-2 border-orange-500 h-[68px]">
          <div className="grid grid-cols-2 gap-1 h-full">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="text-[10px] text-center flex items-center justify-center whitespace-nowrap overflow-hidden">
                {synergies[index] ? (
                  <span className="text-yellow-300 bg-yellow-900/30 border border-yellow-600/50 rounded px-1 w-full block">
                    {truncateSynergy(synergies[index])}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health bar */}
      <div className="bg-linear-to-r from-green-900 to-blue-900 bg-opacity-50 p-3 rounded-lg border-2 border-green-500">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400 shrink-0" />
          <div className="flex-1 relative">
            <div className="w-full bg-gray-800 rounded-full h-6 border-2 border-green-400">
              <div 
                className="bg-linear-to-r from-green-500 to-blue-500 h-full rounded-full transition-all"
                style={{ width: `${(playerHP / maxPlayerHP) * 100}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {playerHP} / {maxPlayerHP}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileGameInfo;
