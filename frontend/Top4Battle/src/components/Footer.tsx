import { Smile, Mail } from 'lucide-react';
import { FaYoutube, FaDiscord } from "react-icons/fa";

interface FooterProps {
  onFeedbackClick: () => void;
}

const Footer = ({ onFeedbackClick }: FooterProps) => {
  return (
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
              onClick={onFeedbackClick}
              className="text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Send Feedback
            </button>
            <a
              href="https://discord.gg/N3TMnx5f7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm"
            >
              <FaDiscord className="w-4 h-4" />
              Join Discord
            </a>
            <a
              href="https://www.youtube.com/watch?v=dTzUGpEE9ls"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 md:mb-0 text-[#BBCCEE] hover:text-white font-semibold py-2 px-4 flex items-center gap-2 transition-all text-sm"
            >
              <FaYoutube className="w-4 h-4" />
              Inspired by JangoDisc
            </a>
          </div>
        </div>
        <div className='mb-2 md:mb-0'>
          <p className='text-center text-xs text-gray-400'>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
