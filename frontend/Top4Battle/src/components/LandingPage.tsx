import { useNavigate } from 'react-router-dom'
import { Swords, Film, Trophy, AlertCircle, Mail, X } from 'lucide-react'
import { useState } from 'react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', message: '' })
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('Top 4 Arena Feedback')
    const body = encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`)
    window.location.href = `mailto:top4arena@proton.me?subject=${subject}&body=${body}`
    setFormData({ name: '', message: '' })
    setIsPanelOpen(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center p-2 overflow-auto">
      <div className="max-w-5xl w-full flex flex-col items-center justify-center space-y-6">
        {/* Early Access Banner */}
        <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-3 flex items-center justify-center gap-3 w-full">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <p className="text-base font-bold text-yellow-300">
            EARLY TESTING - We welcome your feedback!
          </p>
        </div>

        {/* Title */}
        <div className="my-8 w-full text-center">
          <h1 className="pb-2 text-5xl md:text-7xl font-bold bg-linear-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent">
            TOP 4 ARENA
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">Movie Battle Deckbuilder</p>
        </div>

        {/* Features */}
        <div className="px-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 w-full text-center">
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Film className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <h3 className="text-lg font-bold mb-2">Build Your Deck</h3>
            <p className="text-sm text-gray-300">Take your Top 4 films into battle</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Swords className="w-10 h-10 mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-bold mb-2">Strategic Combat</h3>
            <p className="text-sm text-gray-300">Stat combos and genre synergies</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="text-lg font-bold mb-2">Defeat Bosses</h3>
            <p className="text-sm text-gray-300">Slay blockbusters with specials abilities</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center px-3 py-5 w-full">
          <button
            onClick={() => navigate('/game')}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xl md:text-2xl font-bold py-4 px-8 md:px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto cursor-pointer"
          >
            Start Battle
          </button>
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-black text-lg md:text-xl justify-center font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 w-full md:w-auto cursor-pointer"
          >
            <Mail className="w-5 h-5" />
            Send Feedback
          </button>
        </div>

        {/* How to Play */}
        <div className="text-left bg-white/5 backdrop-blur-sm p-5 rounded-lg border border-white/10 w-full max-w-2xl mx-auto mb-4">
          <h2 className="text-lg md:text-xl font-bold mb-3 text-center">How to Play</h2>
          <ul className="space-y-1 text-sm md:text-base text-gray-300">
            <li>• Select 1-4 cards from your hand to attack</li>
            <li>• Build combos with genre synergies for bonus damage</li>
            <li>• Defeat the boss before your HP reaches zero</li>
            <li>• Discard weak cards once per turn to draw new ones</li>
            <li>• Mobile play not currently supported</li>
          </ul>
        </div>
      </div>

      {/* Sliding Feedback Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-yellow-400" />
              Send Feedback
            </h2>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-300">Name (optional)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Your name"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-bold mb-2 text-gray-300">
                Feedback / Bug Report / Feature Request
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="flex-1 w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                placeholder="Tell us what you think, report bugs, or suggest features..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
            >
              Send via Email
            </button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isPanelOpen && (
        <div
          onClick={() => setIsPanelOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </div>
  );
};

export default LandingPage;