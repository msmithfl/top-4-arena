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

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Left: ATK and DEF side by side */}
        <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-3 rounded-lg border-2 border-orange-500">
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
        
        {/* Right: Synergies 2x2 grid */}
        <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-2 rounded-lg border-2 border-orange-500">
          {synergies.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 h-full">
              {synergies.slice(0, 4).map((syn, i) => (
                <div key={i} className="text-[10px] text-yellow-300 bg-yellow-900/30 border border-yellow-600/50 rounded px-1 py-1 text-center flex items-center justify-center">
                  {syn}
                </div>
              ))}
              {/* Fill empty slots if less than 4 synergies */}
              {Array.from({ length: Math.max(0, 4 - synergies.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="text-[10px] text-gray-500 italic flex items-center justify-center">
                  -
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic flex items-center justify-center h-full">
              NO SYNERGIES
            </div>
          )}
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
