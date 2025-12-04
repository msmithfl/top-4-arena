import React from 'react';

interface TurnCounterProps {
  turn: number;
  round: number;
}

const TurnCounter: React.FC<TurnCounterProps> = ({ turn, round }) => {
  return (
    <div className='px-6 py-3 bg-gray-800 bg-opacity-50 border-2 rounded-lg border-gray-600 flex gap-6 items-center justify-center'>
        <div className="flex items-center gap-2">
          <p className="text-xl text-gray-400">Round</p>
          <p className="text-2xl font-bold text-blue-400">{round}</p>
        </div>
        <div className="w-px h-8 bg-gray-600"></div>
        <div className="flex items-center gap-2">
          <p className="text-xl text-gray-400">Turn</p>
          <p className="text-2xl font-bold text-yellow-400">{turn}</p>
        </div>
    </div>
  );
};

export default TurnCounter;
