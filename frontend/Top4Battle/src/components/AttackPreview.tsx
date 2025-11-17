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
  return (
    <div className="bg-linear-to-r from-orange-900 to-red-900 bg-opacity-50 p-4 rounded-lg border-2 border-orange-500">
      <div className="flex items-center gap-2 mb-3">
        <Swords className="w-6 h-6 text-orange-400" />
        <span className="text-lg font-bold">Attack Preview</span>
      </div>
      
      {selectedCards.length > 0 ? (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Cards Selected:</span>
              <span className="text-xl font-bold text-yellow-400">{selectedCards.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Damage:</span>
              <span className="text-2xl font-bold text-red-400">
                {(() => {
                  const playedCards = hand.filter(card => selectedCards.includes(card.id));
                  const result = calculateBattle(playedCards);
                  let damage = result.damage;
                  if (boss?.ability.name === '😢 EMOTIONAL WEIGHT') {
                    damage = Math.round(damage * 0.7);
                  }
                  if (boss?.ability.name === '🛡️ TECH SHIELD') {
                    damage = Math.max(0, damage - 1500);
                  }
                  return damage;
                })()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Defense:</span>
              <span className="text-xl font-bold text-blue-400">
                {(() => {
                  const playedCards = hand.filter(card => selectedCards.includes(card.id));
                  return calculateBattle(playedCards).defense;
                })()}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 mb-2">Synergies:</p>
            {(() => {
              const playedCards = hand.filter(card => selectedCards.includes(card.id));
              const result = calculateBattle(playedCards);
              return result.synergies.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.synergies.map((syn, i) => (
                    <div key={i} className="text-xs text-yellow-300">
                      {syn}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic">No synergies</div>
              );
            })()}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 italic py-4">
          Select cards to see attack preview
        </div>
      )}
    </div>
  );
};

export default AttackPreview;
