import React from 'react';
import { Film } from 'lucide-react';

interface BattleLogProps {
  battleLog: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  return (
    <div className="flex-1 bg-gray-900 bg-opacity-70 p-4 rounded-lg border-2 border-gray-700 overflow-hidden flex flex-col">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <Film className="w-5 h-5" />
        Battle Log
      </h3>
      <div className="space-y-1 text-sm font-mono overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
        {battleLog.length === 0 && (
          <div className="text-gray-500 italic">Battle log will appear here...</div>
        )}
        {battleLog.map((log, i) => (
          <div key={i} className={log.startsWith('---') ? 'border-t border-gray-700 my-2' : log.startsWith('⚔️') ? 'font-bold text-yellow-400 mt-3' : ''}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
