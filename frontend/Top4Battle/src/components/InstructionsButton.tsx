import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const InstructionsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-blue-500">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">How to Play</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Game Objective */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">🎯 Objective</h3>
                <p className="text-gray-300">
                  Defeat the Boss movie by reducing its HP to 0 before your Life Points run out!
                </p>
              </section>

              {/* Basic Rules */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">📜 Basic Rules</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• You start with <span className="text-green-400">3000 HP</span> and a hand of <span className="text-blue-400">7 cards</span></li>
                  <li>• Select 1-4 cards and click <span className="text-red-400">ATTACK</span> to deal damage to the boss</li>
                  <li>• After attacking, your hand refills back to 7 cards</li>
                  <li>• You can <span className="text-yellow-400">DISCARD</span> selected cards once per turn to draw new ones</li>
                  <li>• The boss counter-attacks each turn based on its special ability</li>
                </ul>
              </section>

              {/* Combat Calculations */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">⚔️ Combat Calculations</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-1">Attack Damage</h4>
                    <p className="text-gray-300 text-sm">
                      Each card has <span className="font-bold">Base Power</span> (rating × 100) multiplied by:
                    </p>
                    <ul className="text-gray-300 text-sm ml-4 mt-1">
                      <li>• <span className="text-yellow-300">Star Power</span>: Based on vote count, revenue, and popularity</li>
                      <li>• <span className="text-green-300">Revenue Tier</span>: Blockbuster (2x), Hit (1.5x), or Modest (1x)</li>
                      <li>• <span className="text-purple-300">Era Bonus</span>: Legendary/Classic/Recent films get multipliers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-1">Defense</h4>
                    <p className="text-gray-300 text-sm">
                      Your defense equals <span className="font-bold">60% of total Base Power</span> from played cards.
                      The boss ignores 50-75% of your defense based on its ability.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-1">Synergies</h4>
                    <p className="text-gray-300 text-sm mb-2">Playing cards with matching attributes boosts your damage:</p>
                    <ul className="text-gray-300 text-sm ml-4 space-y-1">
                      <li>• <span className="text-orange-300">Genre Synergy</span>: 2+ same genre (1.5x), 3+ (2x), 4 (3x)</li>
                      <li>• <span className="text-purple-300">Era Unity</span>: All cards from same decade (1.4x)</li>
                      <li>• <span className="text-yellow-300">Masterpiece</span>: Avg rating 8.5+ (+800 dmg) or 8.0+ (+500 dmg)</li>
                      <li>• <span className="text-red-300">Action Bonus</span>: Playing Action genre cards (+300 dmg)</li>
                      <li>• <span className="text-pink-300">Horror Lifesteal</span>: Horror cards heal 20% of damage dealt</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Boss Abilities */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">👑 Boss Abilities</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Each boss has a unique ability based on its genre:
                </p>
                <ul className="text-gray-300 text-sm ml-4 space-y-1">
                  <li>• <span className="text-red-300">⚔️ Rampage</span>: Deals 2x damage every 3rd turn</li>
                  <li>• <span className="text-pink-300">🩸 Lifesteal</span>: Heals 15% of max HP each turn</li>
                  <li>• <span className="text-gray-400">😢 Emotional Weight</span>: Your attacks deal 30% less damage</li>
                  <li>• <span className="text-blue-300">🛡️ Tech Shield</span>: Absorbs first 1500 damage per turn</li>
                  <li>• <span className="text-yellow-300">🎯 Precision Strike</span>: Ignores 75% of your defense</li>
                </ul>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">💡 Strategy Tips</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Look for genre synergies to maximize damage multipliers</li>
                  <li>• Save high-rated cards for combo plays</li>
                  <li>• Use the Attack Preview to plan your best moves</li>
                  <li>• Discard weak cards early to find better synergies</li>
                  <li>• Watch the boss's ability and plan your defense accordingly</li>
                </ul>
              </section>
            </div>

            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-all"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructionsButton;
