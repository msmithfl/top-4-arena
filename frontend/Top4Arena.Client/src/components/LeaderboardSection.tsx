import { GiLaurelsTrophy } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { AWARDS } from '../data/userAwards';

const LeaderboardSection = () => {
  const [leaderboardData, setLeaderboardData] = useState<Array<{ username: string; bestRun: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<'all-time' | 'weekly' | 'daily'>('daily');
  const [selectedAwardHover, setSelectedAwardHover] = useState<{awardId: string, awardTitle: string, description: string} | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5157';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/leaderboard?period=${timePeriod}`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timePeriod]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-white/70";
  };

  return (
    <div id="leaderboard-section" className="w-full px-6 pb-6 pt-4 bg-[#14181C]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Leaderboard - 3/4 width */}
          <div className="w-full lg:w-3/5">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Leaderboards</h2>
              <select 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as 'all-time' | 'weekly' | 'daily')}
                className="bg-[#2C3440] border border-white/10 text-white rounded-lg px-2 py-2 font-bold cursor-pointer hover:bg-[#3C4450] transition-colors"
              >
                <option value="daily">Last 24 Hours</option>
                <option value="weekly">Last 7 Days</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
            {/* Header Row */}
            <div className="px-4 py-2 mb-2">
              <div className="flex items-center gap-4">
                <div className="w-9 md:w-26 text-center">
                  <p className="text-white/50 text-xs font-bold">RANK</p>
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-xs font-bold">USERNAME</p>
                </div>
                <div className="flex gap-6">
                  <div className="w-24 text-right md:text-left">
                    <p className="text-white/50 text-xs font-bold pr-4 md:pr-0">ROUND</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] md:max-h-[1200px] overflow-y-auto scrollbar-thin pr-4 md:pr-0">
              {isLoading ? (
                <div className="text-center py-8 text-white/50 min-h-[400px]">Loading leaderboard...</div>
              ) : (
                [...Array(15)].map((_, index) => {
                  const player = leaderboardData[index];
                  const rank = index + 1;
                  
                  return (
                    <div
                      key={rank}
                      className="bg-white/10 rounded-lg border border-white/20 px-4 py-2 hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className={`flex justify-center gap-2 w-9 md:w-26 ${player ? getRankColor(rank) : 'text-white/70'} font-bold text-xl`}>
                          <span>{rank}</span>
                        </div>

                        {/* Username */}
                        <div className="flex-1">
                          <p className="text-white md:text-lg">{player ? player.username : '-'}</p>
                        </div>

                        {/* Round */}
                        <div className="flex gap-6 text-right md:text-left">
                          <div className="w-24">
                            <p className="text-white text-lg">{player ? player.bestRun : '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Awards - 1/4 width */}
          <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold">AWARDS</h2>
            </div>
            <div className="h-px bg-white/50 mb-3"></div>
            
            {/* Fixed tooltip outside scroll container */}
            {/* Tooltip absolutely positioned above the hovered award */}
            {selectedAwardHover && (
              <div
                className="absolute z-50 pointer-events-none"
                style={{
                  left: '50%',
                  top: 0,
                  transform: 'translate(-50%, calc(-100% - 10px))',
                  width: 'max-content',
                  minWidth: '180px',
                  maxWidth: '260px',
                }}
              >
                <div className="bg-black/95 border border-white/20 rounded-lg p-3 shadow-xl whitespace-nowrap">
                  <p className="text-sm font-bold text-white">
                    {selectedAwardHover.awardTitle}
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    {selectedAwardHover.description}
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-2 gap-4 max-h-full">
              {AWARDS.map((award) => {
                return (
                  <div
                    key={award.awardId}
                    className="relative backdrop-blur-sm p-6 rounded-lg border bg-white/10 border-white/20 flex items-center justify-center aspect-square transition-all cursor-pointer hover:bg-white/15"
                    onMouseEnter={() => setSelectedAwardHover(award)}
                    onMouseLeave={() => setSelectedAwardHover(null)}
                  >
                    {selectedAwardHover?.awardId === award.awardId && (
                      <div
                        className="absolute z-50 pointer-events-none"
                        style={{
                          left: '50%',
                          top: 0,
                          transform: 'translate(-50%, calc(-100% - 10px))',
                          width: 'max-content',
                          maxWidth: '260px',
                        }}
                      >
                        <div className="bg-black/95 border border-white/20 rounded-lg p-3 shadow-xl whitespace-nowrap">
                          <p className="text-sm font-bold text-white">
                            {award.awardTitle}
                          </p>
                          <p className="text-xs text-white/70 mt-1">
                            {award.description}
                          </p>
                        </div>
                      </div>
                    )}
                    <GiLaurelsTrophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;