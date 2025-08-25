import React, { useState } from 'react';
import { CopyIcon } from './icons.jsx';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400 group-hover:text-gray-200 transition-colors"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const ReplySuggestionCard = ({ type, text, rationale }) => {
  const [copied, setCopied] = useState(false);
  const [showRationale, setShowRationale] = useState(false);

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeStyles = {
    "Spicy": "from-rose-400 to-orange-400",
    "Casual": "from-sky-400 to-cyan-400",
    "Honest": "from-teal-400 to-emerald-400",
  }
  const defaultTypeStyle = "from-blue-400 to-cyan-400";

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-500/20 mb-4 ring-1 ring-white/10 hover:bg-gray-700/30 transition-all duration-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${typeStyles[type] || defaultTypeStyle}`}>{type}</h4>
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowRationale(true)}
            onMouseLeave={() => setShowRationale(false)}
          >
            <InfoIcon />
            {showRationale && (
              <div className="absolute bottom-full mb-2 w-48 bg-gray-900/95 backdrop-blur-sm text-gray-200 text-xs rounded-lg py-2 px-3 z-10 right-0 transform translate-x-1/2 opacity-100 transition-opacity border border-blue-500/30 shadow-xl">
                <p className="font-bold text-blue-300">The Strategy:</p>
                <p className="mt-1">{rationale}</p>
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">
            <CopyIcon copied={copied} />
            <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed">{text}</p>
    </div>
  );
};

export default ReplySuggestionCard;
