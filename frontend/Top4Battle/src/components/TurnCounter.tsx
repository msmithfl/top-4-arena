import React from 'react';
import { HiOutlineBackspace } from "react-icons/hi2";
import { Link } from 'react-router-dom';

interface TurnCounterProps {
  turn: number;
  round: number;
}

const TurnCounter: React.FC<TurnCounterProps> = ({ turn, round }) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg text-center">
      <div>
        <Link
          to='/'
          className="bg-rose-500 hover:bg-rose-700 py-6 px-2 ml-1 rounded-lg font-bold flex items-center gap-2 justify-center shadow-lg transition-all"
        >
          <HiOutlineBackspace className="w-10 h-10" />
        </Link>
      </div>
      <div className='px-6 py-3 bg-gray-800 bg-opacity-50 border-2 rounded-lg border-gray-600 flex gap-6 items-center'>
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
