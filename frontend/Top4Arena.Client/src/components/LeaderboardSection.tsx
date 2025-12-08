import { GiLaurelsTrophy } from 'react-icons/gi';

const LeaderboardSection = () => {
  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, username: "MovieMaster99", bestRun: 15, topCombo: 45200 },
    { rank: 2, username: "FilmFanatic", bestRun: 14, topCombo: 38500 },
    { rank: 3, username: "CinephileKing", bestRun: 13, topCombo: 35800 },
    { rank: 4, username: "ReelDeal", bestRun: 12, topCombo: 32100 },
    { rank: 5, username: "BlockbusterBoss", bestRun: 11, topCombo: 28900 },
    { rank: 6, username: "SilverScreen", bestRun: 10, topCombo: 25600 },
    { rank: 7, username: "PopcornPro", bestRun: 9, topCombo: 22300 },
    { rank: 8, username: "DirectorsCut", bestRun: 9, topCombo: 20800 },
    { rank: 9, username: "TicketStub", bestRun: 8, topCombo: 18500 },
    { rank: 10, username: "CreditCrawler", bestRun: 8, topCombo: 16200 }
  ];

  // const formatCombo = (combo: number) => {
  //   if (combo >= 1000) return `${(combo / 1000).toFixed(1)}k`;
  //   return combo.toString();
  // };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-white/70";
  };

  return (
    <div id="leaderboard-section" className="w-full px-6 pb-6 pt-4 bg-[#14181C]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Leaderboard - 3/4 width */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Leaderboards</h2>
            {/* Header Row */}
            <div className="md:w-11/12 px-4 py-2 mb-2">
              <div className="flex items-center gap-4">
                <div className="w-9 md:w-26 text-center">
                  <p className="text-white/50 text-xs font-bold">RANK</p>
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-xs font-bold">USERNAME</p>
                </div>
                <div className="flex gap-6">
                  <div className="w-24 text-right md:text-left">
                    <p className="text-white/50 text-xs font-bold">ROUND</p>
                  </div>
                  {/* <div className="w-px"></div>
                  <div className="w-24 text-right">
                    <p className="text-white/50 text-xs font-bold">TOP COMBO</p>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="md:w-11/12 space-y-2 max-h-[600px] md:max-h-[1200px] overflow-y-auto scrollbar-thin">
              {leaderboardData.map((player) => (
                <div
                  key={player.rank}
                  className="bg-white/10 rounded-lg border border-white/20 px-4 py-2 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`flex justify-center gap-2 w-9 md:w-26 ${getRankColor(player.rank)} font-bold text-xl`}>
                      {player.rank === 1}
                      {player.rank === 2}
                      {player.rank === 3}
                      <span>{player.rank}</span>
                    </div>

                    {/* Username */}
                    <div className="flex-1">
                      <p className="text-white md:text-lg">{player.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-right md:text-left">
                      <div className="w-24">
                        <p className="text-white text-lg">{player.bestRun}</p>
                      </div>
                      {/* <div className="w-px bg-white/20"></div>
                      <div className="w-24">
                        <p className="font-bold text-orange-400 text-lg">{formatCombo(player.topCombo)}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold">AWARDS</h3>
              {/* <span className="text-white/50 md:mr-5">0/12</span> */}
            </div>
            <div className="h-px bg-white/50 mb-3"></div>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 max-h-[220px] md:max-h-[1200px] overflow-y-auto scrollbar-thin pr-4 md:pr-0">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-6 rounded-lg border border-white/20 flex items-center justify-center aspect-square hover:bg-white/15 transition-colors relative isolate"
                >
                  <GiLaurelsTrophy className="w-14 h-12 text-yellow-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;
