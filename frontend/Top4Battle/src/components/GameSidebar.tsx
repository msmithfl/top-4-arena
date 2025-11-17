import React from 'react';
import TurnCounter from './TurnCounter';
import LifePoints from './LifePoints';
import AttackPreview from './AttackPreview';
import BattleLog from './BattleLog';
import type { MovieCard, BossCard, BattleResult } from '../types';

interface GameSidebarProps {
  turn: number;
  playerHP: number;
  selectedCards: number[];
  hand: MovieCard[];
  boss: BossCard | null;
  battleLog: string[];
  calculateBattle: (cards: MovieCard[]) => BattleResult;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  turn,
  playerHP,
  selectedCards,
  hand,
  boss,
  battleLog,
  calculateBattle
}) => {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-4 h-full overflow-hidden">
      <TurnCounter turn={turn} />
      <LifePoints playerHP={playerHP} />
      <AttackPreview
        selectedCards={selectedCards}
        hand={hand}
        boss={boss}
        calculateBattle={calculateBattle}
      />
      <BattleLog battleLog={battleLog} />
    </div>
  );
};

export default GameSidebar;
