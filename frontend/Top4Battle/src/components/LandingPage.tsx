import { useNavigate } from 'react-router-dom'
import { Swords, Film, Trophy, Mail, X, Smile } from 'lucide-react'
import { useState } from 'react'
import { FaYoutube } from "react-icons/fa";
import MovieCarousel from './MovieCarousel';

const APP_VERSION = "0.1.0-early"; // Set your version here

const LandingPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    message: `\n\n---\nFeedback for Top 4 Arena v${APP_VERSION}\n`
  })
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('Top 4 Arena Feedback')
    const body = encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`)
    window.location.href = `mailto:top4arena@proton.me?subject=${subject}&body=${body}`
    setFormData({ name: '', message: `\n\n---\nFeedback for Top 4 Arena v${APP_VERSION}\n` })
    setIsPanelOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#14181C] text-white flex flex-col items-center overflow-x-hidden relative">
      {/* Logo in top left corner on desktop, centered on mobile */}
      <img 
        src="/favicon-top4.png" 
        alt="Top 4 Arena Logo" 
        className="absolute top-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 w-16 h-16 z-10"
      />
      
      <div className="max-w-5xl w-full flex flex-col items-center justify-end space-y-6 grow pt-16 md:pt-0">

        {/* Title */}
        <div className="mb-2 mt-8 md:mb-6 w-full text-center">
          <h1 className="pb-2 md:pb-0 text-5xl md:text-7xl font-bold text-white bg-clip-text">
            TOP 4 ARENA<span className='text-xs text-amber-300 md:inline block'>EARLY ACCESSv0.1.0</span>
          <p className="pt-4 text-xl md:text-2xl text-gray-300 ">Movie Battle Deckbuilder</p>
          </h1>
        </div>

        {/* Feature Cards */}
        <div className="px-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 w-full text-center">
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Film className="w-10 h-10 mx-auto mb-3 text-orange-500" />
            <h3 className="text-lg font-bold mb-2">Collect Movie Cards</h3>
            <p className="text-sm text-gray-300">Take your Top 4 films into battle</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Swords className="w-10 h-10 mx-auto mb-3 text-green-400" />
            <h3 className="text-lg font-bold mb-2">Strategic Combat</h3>
            <p className="text-sm text-gray-300">Stat combos and genre synergies</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-blue-400" />
            <h3 className="text-lg font-bold mb-2">Defeat Bosses</h3>
            <p className="text-sm text-gray-300">Slay movie villians with specials abilities</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-center px-3 py-4 w-full">
          <button
            onClick={() => {
              const isMobile = window.innerWidth < 768;
              window.scrollTo(0, 0);
              navigate(isMobile ? '/mobile-not-supported' : '/game');
            }}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xl md:text-2xl font-bold py-4 px-8 md:px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto cursor-pointer"
          >
            Start Battle
          </button>
        </div>
      </div>

      {/* Movie Carousel - Reserve space to prevent layout shift */}
      <div className="w-screen" style={{ minHeight: '200px' }}>
        <MovieCarousel />
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
                placeholder={`Tell us what you think, report bugs, or suggest features...\n\n---\nFeedback for Top 4 Arena v${APP_VERSION}\n`}
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

      {/* Footer */}
      <footer className="w-full bg-[#2C3440] border-t border-white/10 py-2">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <a
                href="https://buymeacoffee.com/msmithfls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm"
              >
                <Smile className="w-4 h-4" />
                Support This Project
              </a>
              <button
                onClick={() => setIsPanelOpen(true)}
                className="text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Send Feedback
              </button>
              <a
                href="https://www.youtube.com/watch?v=dTzUGpEE9ls&t=112s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm"
              >
                Inspired by JangoDisc
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <p className='text-center text-xs text-gray-400'>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;