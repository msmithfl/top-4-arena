import React from 'react';
import TurnCounter from './TurnCounter';
import LifePoints from './LifePoints';
import AttackPreview from './AttackPreview';
//import BattleLog from './BattleLog';
import type { MovieCard, BossCard, BattleResult } from '../types';

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
    </div>
  );
};

export default GameSidebar;
