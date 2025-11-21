import React, { useState } from 'react';
import { HiOutlineBackspace } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';

const EndGameButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleEndGame = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      <button
        title="End Game"
        onClick={() => setIsOpen(true)}
        className="bg-rose-500 hover:bg-rose-700 w-10 h-10 p-0 rounded-lg font-bold flex items-center justify-center shadow-lg transition-all cursor-pointer"
      >
        <HiOutlineBackspace className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg text-left max-w-md w-full border-4 border-rose-500">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">End Current Game?</h2>
              <p className="text-gray-300">
                Are you sure you want to end this run and return to the main menu?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold border border-gray-600 text-gray-200 hover:bg-gray-800 transition-all"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleEndGame}
                  className="px-4 py-2 rounded-lg font-semibold bg-rose-500 hover:bg-rose-700 text-white transition-all"
                >
                  End Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EndGameButton;

