import React from 'react';
import InstructionsButton from './InstructionsButton';
import { DoorOpen  } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TurnCounterProps {
  turn: number;
}

const TurnCounter: React.FC<TurnCounterProps> = ({ turn }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 p-3 rounded-lg border-2 border-gray-600 text-center">
        <div className=''>
            <Link
            to='/'
            className="bg-rose-500 hover:bg-rose-700 px-1 py-2 mb-2 rounded-lg font-bold flex items-center gap-2 justify-center shadow-lg transition-all"
          >
            <DoorOpen className="w-5 h-5" />
            Quit
          </Link>
            <InstructionsButton />
        </div>
        <div className='mx-auto'>
            <p className="text-xl text-gray-400">Turn</p>
            <p className="text-3xl font-bold text-yellow-400">{turn}</p>
        </div>
    </div>
  );
};

export default TurnCounter;
