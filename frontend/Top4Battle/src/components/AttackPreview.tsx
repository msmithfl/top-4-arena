import React from 'react';
import { Swords } from 'lucide-react';
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
    <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-4 rounded-lg border-2 border-orange-500">
      <div className="flex items-center gap-2 mb-3">
        <Swords className="w-6 h-6 text-orange-400" />
        <span className="text-lg font-bold">Attack Preview</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Cards Selected:</span>
          <span className="text-xl font-bold text-yellow-400">
            {selectedCards.length > 0 ? selectedCards.length : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Damage:</span>
          <span className="text-2xl font-bold text-red-400">
            {selectedCards.length > 0 ? damage : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">Defense:</span>
          <span className="text-xl font-bold text-blue-400">
            {selectedCards.length > 0 ? defense : '--'}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-600">
        <p className="text-xs text-gray-400 mb-2">Synergies:</p>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {selectedCards.length > 0 ? (
            synergies.length > 0 ? (
              synergies.map((syn, i) => (
                <div key={i} className="text-xs text-yellow-300">
                  {syn}
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 italic">No synergies</div>
            )
          ) : (
            <div className="text-xs text-gray-500 italic">--</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttackPreview;