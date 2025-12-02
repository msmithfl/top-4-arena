import React from 'react';
import { Skull, Zap, Swords, Heart } from 'lucide-react';
import type { BossCard } from '../types';

interface BossCardProps {
  boss: BossCard;
  bossHP: number;
}

const BossCardComponent: React.FC<BossCardProps> = ({ boss, bossHP }) => {
  return (
    <div className="bg-linear-to-r from-red-900 to-orange-900 bg-opacity-50 px-4 pt-4 pb-2 lg:p-6 rounded-lg border-4 border-red-500 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-start">
        {/* Top section on mobile: poster and info side by side */}
        <div className="flex items-start gap-6 w-full lg:w-auto">
          <div className="relative shrink-0">
            <img 
              src={`https://image.tmdb.org/t/p/w200${boss.poster_path}`}
              alt={boss.title}
              className="w-full lg:w-40 h-40 lg:h-60 object-cover rounded-lg shadow-lg border-2 border-red-400"
            />
            <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-2">
              <Skull className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 lg:flex-initial">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl lg:text-4xl font-bold text-red-300">{boss.title}</h2>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-yellow-300">
                <Zap className="w-5 h-5" />
                <span className="text-sm lg:text-lg font-bold">{boss.ability.name}</span>
              </div>
              <p className="text-xs lg:text-sm text-gray-300 italic">{boss.ability.description}</p>
              <div className="flex items-center gap-2 text-red-300">
                <Swords className="w-5 h-5" />
                {/* <span>Attack: {boss.baseDamage} | Ignores {Math.round(boss.defenseIgnore * 100)}% Defense</span> */}
                <span>Attack: {boss.baseDamage}</span>
              </div>
              <div className="flex gap-2">
                {boss.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 bg-red-700 rounded-full text-sm font-bold">
                    {g.name === 'Science Fiction' ? 'Sci-Fi' : g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Health bar - full width on mobile, on the right on desktop */}
        <div className="space-y-2 w-full lg:flex-1">
          {/* Desktop: HP above bar */}
          <div className="hidden lg:flex justify-between text-sm font-bold">
            <span></span>
            <div className='flex gap-2 items-center flex-nowrap whitespace-nowrap'>
              <Heart className="w-8 h-8 text-red-400 shrink-0" />
              <span className="text-xl">{bossHP} / {boss.maxHP}</span>
            </div>
          </div>
          
          {/* Mobile: Heart icon + bar with HP inside */}
          <div className="flex lg:hidden items-center gap-2">
            <Heart className="w-6 h-6 text-red-400 shrink-0" />
            <div className="flex-1 relative">
              <div className="w-full bg-gray-800 rounded-full h-6 border-2 border-red-400">
                <div 
                  className="bg-linear-to-r from-red-600 to-orange-500 h-full rounded-full transition-all shadow-lg"
                  style={{ width: `${(bossHP / boss.maxHP) * 100}%` }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {bossHP} / {boss.maxHP}
                </span>
              </div>
            </div>
          </div>
          
          {/* Desktop: Just the bar */}
          <div className="hidden lg:block w-full bg-gray-800 rounded-full h-6 border-2 border-red-400">
            <div 
              className="bg-linear-to-r from-red-600 to-orange-500 h-full rounded-full transition-all shadow-lg flex-nowrap"
              style={{ width: `${(bossHP / boss.maxHP) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossCardComponent;
