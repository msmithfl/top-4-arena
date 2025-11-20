import React from 'react';
//import { Swords } from 'lucide-react';
import type { MovieCard, BossCard, BattleResult } from '../types';

interface AttackPreviewProps {
  selectedCards: number[];
  hand: MovieCard[];
  boss: BossCard | null;
  calculateBattle: (cards: MovieCard[]) => BattleResult;
}

const AttackPreview: React.FC<AttackPreviewProps> = ({
  selectedCards,
  hand,
  boss,
  calculateBattle
}) => {
  const playedCards = hand.filter(card => selectedCards.includes(card.id));
  const result = selectedCards.length > 0 ? calculateBattle(playedCards) : null;

  let damage = result ? result.damage : 0;
  if (boss && result) {
    if (boss.ability.name === '😢 EMOTIONAL WEIGHT') {
      damage = Math.round(damage * 0.7);
    }
    if (boss.ability.name === '🛡️ TECH SHIELD') {
      damage = Math.max(0, damage - 1500);
    }
  }

  const defense = result ? result.defense : 0;
  const synergies = result ? result.synergies : [];

  return (
    <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-4 rounded-lg border-2 border-orange-500 h-full flex flex-col">
      <div className="space-y-2 flex items-start justify-between gap-4 px-8">
        <div className="flex flex-col justify-between items-center">
          <span className="text-xl text-gray-300">ATK</span>
          <span className="text-3xl font-bold text-red-400">
            {selectedCards.length > 0 ? damage : '0'}
          </span>
        </div>
        <div className="flex flex-col justify-between items-center">
          <span className="text-xl text-gray-300">DEF</span>
          <span className="text-3xl font-bold text-blue-400">
            {selectedCards.length > 0 ? defense : '0'}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-600 flex-1 flex flex-col min-h-0">
        <p className="text-lg text-center text-gray-300 mb-2">SYNERGIES</p>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
          {selectedCards.length > 0 ? (
            synergies.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {synergies.map((syn, i) => (
                  <div key={i} className="text-xs text-yellow-300 bg-yellow-900/30 border border-yellow-600/50 rounded px-2 py-1 text-center">
                    {syn}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">No synergies</div>
            )
          ) : (
            <div className="text-xs text-gray-500 italic"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttackPreview;