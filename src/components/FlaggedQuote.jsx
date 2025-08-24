import React from 'react';

const FlaggedQuote = ({ quote, explanation, type }) => {
  const isRedFlag = type === 'red';
  const borderColor = isRedFlag ? 'border-rose-400/60' : 'border-emerald-400/60';
  const bgColor = isRedFlag ? 'bg-rose-500/10' : 'bg-emerald-500/10';
  const textColor = isRedFlag ? 'text-rose-300' : 'text-emerald-300';
  const shadowColor = isRedFlag ? 'shadow-rose-500/20' : 'shadow-emerald-500/20';

  return (
    <div className={`p-4 mb-3 border-l-4 ${borderColor} ${bgColor} rounded-r-lg backdrop-blur-sm shadow-lg ${shadowColor} ring-1 ring-white/5`}>
      <blockquote className={`italic text-sm ${textColor} border-l-transparent pl-2 font-medium`}>
        "{quote}"
      </blockquote>
      <p className={`mt-2 text-xs text-gray-400`}>
        <span className="font-bold">Why it's a {isRedFlag ? 'red' : 'green'} flag:</span> {explanation}
      </p>
    </div>
  );
};

export default FlaggedQuote;
