import React from 'react';
import TurnCounter from './TurnCounter';
import LifePoints from './LifePoints';
import AttackPreview from './AttackPreview';
//import BattleLog from './BattleLog';
import type { MovieCard, BossCard, BattleResult } from '../types';
import InstructionsButton from './InstructionsButton';

interface GameSidebarProps {
  turn: number;
  round: number;
  playerHP: number;
  selectedCards: number[];
  hand: MovieCard[];
  boss: BossCard | null;
  battleLog: string[];
  calculateBattle: (cards: MovieCard[]) => BattleResult;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  turn,
  round,
  playerHP,
  selectedCards,
  hand,
  boss,
  //battleLog,
  calculateBattle
}) => {
  return (
    <div className="px-6 py-6 w-80 bg-[#2C3440] shrink-0 flex flex-col justify-start gap-4 h-full overflow-hidden">
      <TurnCounter turn={turn} round={round}/>
      <LifePoints playerHP={playerHP} />
      <div className="h-1/2 flex flex-col">
        <AttackPreview
          selectedCards={selectedCards}
          hand={hand}
          boss={boss}
          calculateBattle={calculateBattle}
        />
      </div>
      {/* <BattleLog battleLog={battleLog} /> */}
      
      {/* Logo and Title at Bottom */}
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/10">
        <img 
          src="/favicon-top4.png" 
          alt="Top 4 Arena Logo" 
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white">Top 4 Arena</span>
          {/* <span className="text-xs text-gray-400">Movie Battle Deckbuilder</span> */}
        </div>
        <div className='ml-3'>
          <InstructionsButton />
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
