import { X } from 'lucide-react';

interface PatchNotesProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

const PatchNotes: React.FC<PatchNotesProps> = ({ isOpen, onClose, version }) => {
  if (!isOpen) return null;

  const patchNotes = {
    '0.2.0': {
      title: 'Version 0.2.0 - User Profiles & Leaderboards',
      date: 'December 7, 2024',
      features: [
        'Added user authentication with Clerk',
        'User profile dashboard with statistics tracking',
        'Track Best Run, Total Games, and Highest Combo',
        'Save your Top 4 movie preset for quick game starts',
        'Toggle to use your preset as default in Pick Top 4 screen',
        'Dedicated sign-in and sign-up pages',
        'Auto-save functionality for user presets'
      ],
      improvements: [
        'Improved header layout with unified component',
        'Better mobile responsiveness for authentication flows',
        'Enhanced database schema with user stats tracking'
      ],
      bugFixes: [
        'Fixed auto-save race condition causing preset data loss',
        'Fixed toggle switch not saving default preset preference',
        'Improved CORS configuration for production deployment'
      ]
    }
  };

  const notes = patchNotes[version as keyof typeof patchNotes];

  if (!notes) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-50 animate-in fade-in duration-200"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-[#2C3440] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">{notes.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{notes.date}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* New Features */}
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                New Features
              </h3>
              <ul className="space-y-2 text-gray-300">
                {notes.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                Improvements
              </h3>
              <ul className="space-y-2 text-gray-300">
                {notes.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bug Fixes */}
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                Bug Fixes
              </h3>
              <ul className="space-y-2 text-gray-300">
                {notes.bugFixes.map((fix, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatchNotes;
