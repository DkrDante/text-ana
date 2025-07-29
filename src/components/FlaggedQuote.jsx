import React from 'react';

const FlaggedQuote = ({ quote, explanation, type }) => {
  const isRedFlag = type === 'red';
  const borderColor = isRedFlag ? 'border-rose-300' : 'border-emerald-300';
  const bgColor = isRedFlag ? 'bg-rose-50/80' : 'bg-emerald-50/80';
  const textColor = isRedFlag ? 'text-rose-900' : 'text-emerald-900';

  return (
    <div className={`p-3 mb-3 border-l-4 ${borderColor} ${bgColor} rounded-r-lg`}>
      <blockquote className={`italic text-sm ${textColor} border-l-transparent pl-2`}>
        "{quote}"
      </blockquote>
      <p className={`mt-2 text-xs text-slate-600`}>
        <span className="font-bold">Why it's a {isRedFlag ? 'red' : 'green'} flag:</span> {explanation}
      </p>
    </div>
  );
};

export default FlaggedQuote;
