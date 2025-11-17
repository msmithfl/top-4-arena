import React from 'react';
import { Heart } from 'lucide-react';

interface LifePointsProps {
  playerHP: number;
  maxHP?: number;
}

const LifePoints: React.FC<LifePointsProps> = ({ playerHP, maxHP = 3000 }) => {
  return (
    <div className="bg-linear-to-r from-green-900 to-blue-900 bg-opacity-50 p-4 rounded-lg border-2 border-green-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400" />
          <span className="text-lg font-bold">Life Points</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-center mb-2">{playerHP} / {maxHP}</div>
      <div className="w-full bg-gray-800 rounded-full h-4 border-2 border-green-400">
        <div 
          className="bg-linear-to-r from-green-500 to-blue-500 h-full rounded-full transition-all"
          style={{ width: `${(playerHP / maxHP) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default LifePoints;
