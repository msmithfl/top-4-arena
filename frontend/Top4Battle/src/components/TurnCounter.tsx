import React from 'react';
import InstructionsButton from './InstructionsButton';
import { HiOutlineBackspace } from "react-icons/hi2";
import { Link } from 'react-router-dom';

interface TurnCounterProps {
  turn: number;
  round: number;
}

const TurnCounter: React.FC<TurnCounterProps> = ({ turn, round }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 p-3 rounded-lg border-2 border-gray-600 text-center">
      <div>
        <Link
          to='/'
          className="bg-rose-500 hover:bg-rose-700 px-1 py-2 mb-2 rounded-lg font-bold flex items-center gap-2 justify-center shadow-lg transition-all"
        >
          <HiOutlineBackspace className="w-5 h-5" />
        </Link>
        <InstructionsButton />
      </div>
      <div className='mx-auto flex gap-6 items-center'>
        <div>
          <p className="text-xl text-gray-400">Round</p>
          <p className="text-3xl font-bold text-blue-400">{round}</p>
        </div>
        <div className="w-px h-12 bg-gray-600"></div>
        <div>
          <p className="text-xl text-gray-400">Turn</p>
          <p className="text-3xl font-bold text-yellow-400">{turn}</p>
        </div>
      </div>
    </div>
  );
};

export default TurnCounter;
