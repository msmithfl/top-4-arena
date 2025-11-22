import React from 'react';
import TurnCounter from './TurnCounter';
import LifePoints from './LifePoints';
import AttackPreview from './AttackPreview';
//import BattleLog from './BattleLog';
import type { MovieCard, BossCard, BattleResult } from '../types';
import InstructionsButton from './InstructionsButton';
import EndGameButton from './EndGameButton';

interface GameSidebarProps {
  turn: number;
  round: number;
  playerHP: number;
  maxPlayerHP: number;
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
  maxPlayerHP,
  selectedCards,
  hand,
  boss,
  //battleLog,
  calculateBattle
}) => {
  return (
    <div className="px-6 py-6 w-80 bg-[#2C3440] shrink-0 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <img 
          src="/favicon-top4.png" 
          alt="Top 4 Arena Logo" 
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white mt-1">TOP 4 ARENA</h3>
          {/* <span className="text-xs text-gray-400">Movie Battle Deckbuilder</span> */}
        </div>
        <div className='ml-auto flex gap-2'>
          <InstructionsButton />
          <EndGameButton />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <TurnCounter turn={turn} round={round}/>
        <LifePoints playerHP={playerHP} maxHP={maxPlayerHP} />
        <div className="h-1/2 flex flex-col">
          <AttackPreview
            selectedCards={selectedCards}
            hand={hand}
            boss={boss}
            calculateBattle={calculateBattle}
          />
        </div>
        {/* <BattleLog battleLog={battleLog} /> */}
      </div>
    </div>
  );
};

export default GameSidebar;
