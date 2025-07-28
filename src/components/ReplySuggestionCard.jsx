import React, { useState } from 'react';

import { CopyIcon } from './icons.jsx';

const ReplySuggestionCard = ({ type, text }) => {
  const [copied, setCopied] = useState(false);

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
        <button onClick={handleCopy} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <CopyIcon copied={copied} />
          <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <p className="text-slate-700 text-sm">{text}</p>
    </div>
  );
};

export default ReplySuggestionCard;

