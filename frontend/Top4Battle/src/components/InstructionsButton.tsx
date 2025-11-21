import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const InstructionsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="How to Play"
        className="bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 rounded-lg font-bold flex items-center justify-center shadow-lg transition-all cursor-pointer"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-900 rounded-lg text-left max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">How to Play</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Objective */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Objective</h3>
                <p className="text-gray-300">
                  Play a hand of 1-4 movie cards, find synergies and defeat the boss.
                </p>
              </section>

              {/* Synergies */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Synergies</h3>
                <p className="text-gray-300 mb-2">
                  Synergies boost your damage and are found when movies have certain qualities in common.
                </p>
                <p className="text-gray-300">
                  Synergies can be based on genre, era, popularity, cast and more. Some synergies do not require a pair.
                </p>
              </section>

              {/* About the Combat */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">About the Combat</h3>
                <p className="text-gray-300 mb-2">
                  In short, your ATTACK is based on the popularity of the film and the DEFENSE is based on the film's runtime. The details of the calculations are highly experimental at this stage.
                </p>
                <p className="text-gray-300">
                  Each boss has a special ability you need to watch out for (Some not implemented). They also might have restrictions or negative affects towards certain card types.
                </p>
              </section>

              {/* The Shop */}
              <section>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">The Shop</h3>
                <p className="text-gray-300">
                  In between rounds, you will have an opportunity to earn a new card by answering a movie trivia question (Card upgrades coming soon).
                </p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-all cursor-pointer"
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
