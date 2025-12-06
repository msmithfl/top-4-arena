import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { User, Trophy, Star, Film, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const ProfileDashboard = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [stats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    achievementsUnlocked: 0,
    favoriteGenre: "None yet"
  });

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-dvh bg-[#14181C] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#14181C] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
            {user.username?.[0]?.toUpperCase() || user.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username || user.firstName || "Player"}</h1>
            <p className="text-white/70">{user.primaryEmailAddress?.emailAddress}</p>
            <p className="text-sm text-white/50 mt-1">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Your Stats
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Games Played</h3>
            </div>
            <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">High Score</h3>
            </div>
            <p className="text-3xl font-bold">{stats.highScore}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Achievements</h3>
            </div>
            <p className="text-3xl font-bold">{stats.achievementsUnlocked}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold">Favorite Genre</h3>
            </div>
            <p className="text-xl font-bold">{stats.favoriteGenre}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all cursor-pointer"
          >
            Start New Game
          </button>
          
          <button
            disabled
            className="bg-white/10 text-white/50 font-bold py-4 px-6 rounded-lg cursor-not-allowed"
          >
            View Leaderboard (Coming Soon)
          </button>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">Coming Soon</h3>
          <ul className="space-y-2 text-white/70">
            <li>• Personal high scores and game history</li>
            <li>• Achievement system and badges</li>
            <li>• Global leaderboards</li>
            <li>• Save and share your Top 4 decks</li>
            <li>• Custom profile avatars</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
