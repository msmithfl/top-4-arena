import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowLeft, Mail, X } from 'lucide-react';
import MovieCarousel from './MovieCarousel';
import Footer from './Footer';
import { useState, useEffect } from 'react';

const APP_VERSION = "0.1.0-early";

const MobileNotSupported = () => {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    message: `\n\n---\nFeedback for Top 4 Arena v${APP_VERSION}\n`
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Top 4 Arena Feedback');
    const body = encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`);
    window.location.href = `mailto:top4arena@proton.me?subject=${subject}&body=${body}`;
    setFormData({ name: '', message: `\n\n---\nFeedback for Top 4 Arena v${APP_VERSION}\n` });
    setIsPanelOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#14181C] text-white flex flex-col items-center overflow-x-hidden relative">
      {/* Logo in top left corner on desktop, centered on mobile */}
      <img 
        src="/favicon-top4.png" 
        alt="Top 4 Arena Logo" 
        className="absolute top-4 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 w-16 h-16 z-10"
      />
      
      <div className="max-w-5xl w-full flex flex-col items-center justify-center space-y-6 grow px-4 pt-24 md:pt-0">
        <Monitor className="w-24 h-24 text-orange-500" />
        <h1 className="text-4xl font-bold text-center">Desktop Only</h1>
        <p className="text-xl text-gray-300 text-center max-w-md">
          Top 4 Arena is not supported on mobile devices yet. Please visit us on a desktop or laptop computer to play!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* Movie Carousel */}
      <div className="w-screen" style={{ minHeight: '320px' }}>
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
      <Footer onFeedbackClick={() => setIsPanelOpen(true)} />
    </div>
  );
};

export default MobileNotSupported;
