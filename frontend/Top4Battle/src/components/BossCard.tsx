import React from 'react';
import { Skull, Zap, Swords, Heart } from 'lucide-react';
import type { BossCard } from '../types';

interface BossCardProps {
  boss: BossCard;
  bossHP: number;
}

const BossCardComponent: React.FC<BossCardProps> = ({ boss, bossHP }) => {
  return (
    <div className="mb-6 bg-linear-to-r from-red-900 to-orange-900 bg-opacity-50 p-6 rounded-lg border-4 border-red-500 shadow-2xl">
      <div className="flex items-start gap-6">
        <div className="relative">
          <img 
            src={`https://image.tmdb.org/t/p/w200${boss.poster_path}`}
            alt={boss.title}
            className="w-40 h-60 object-cover rounded-lg shadow-lg border-2 border-red-400"
          />
          <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-2">
            <Skull className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-bold text-red-300">{boss.title}</h2>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-yellow-300">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{boss.ability.name}</span>
            </div>
            <p className="text-sm text-gray-300 italic">{boss.ability.description}</p>
            <div className="flex items-center gap-2 text-red-300">
              <Swords className="w-5 h-5" />
              <span>Attack: {boss.baseDamage} | Ignores {Math.round(boss.defenseIgnore * 100)}% Defense</span>
            </div>
            <div className="flex gap-2">
              {boss.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-red-700 rounded-full text-sm font-bold">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span></span>
              <div className='flex gap-2 items-center'>
                <Heart className="w-8 h-8 text-red-400" />
                <span className="text-xl w-36 text-right">{bossHP} / {boss.maxHP}</span>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-6 border-2 border-red-400">
              <div 
                className="bg-linear-to-r from-red-600 to-orange-500 h-full rounded-full transition-all shadow-lg"
                style={{ width: `${(bossHP / boss.maxHP) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossCardComponent;
