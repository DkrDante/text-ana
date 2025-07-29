import React, { useState } from 'react';
import { CopyIcon } from './icons.jsx';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
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
    "Spicy": "from-rose-500 to-orange-500",
    "Casual": "from-sky-500 to-cyan-400",
    "Honest": "from-teal-500 to-emerald-500",
  }
  const defaultTypeStyle = "from-purple-500 to-violet-500";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 mb-4">
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
              <div className="absolute bottom-full mb-2 w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 z-10 right-0 transform translate-x-1/2 opacity-100 transition-opacity">
                <p className="font-bold">The Strategy:</p>
                {rationale}
              </div>
            )}
          </div>
          <button onClick={handleCopy} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <CopyIcon copied={copied} />
            <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <p className="text-slate-700 text-sm">{text}</p>
    </div>
  );
};

export default ReplySuggestionCard;

