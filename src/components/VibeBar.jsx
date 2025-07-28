import React from 'react';

// Tailwind CSS color mapping
const colorMap = {
  rose: 'rgb(251 113 133)',
  amber: 'rgb(251 191 36)',
  sky: 'rgb(56 189 248)',
  emerald: 'rgb(52 211 153)',
  indigo: 'rgb(129 140 248)',
  purple: 'rgb(168 85 247)',
};

// Helper function to get qualitative feedback based on score
const getScoreFeedback = (score) => {
  if (score >= 90) {
    return { label: 'CRITICAL', textColor: 'text-rose-500 font-extrabold', pulse: true };
  }
  if (score >= 70) {
    return { label: 'High', textColor: 'text-amber-500 font-bold', pulse: false };
  }
  if (score >= 30) {
    return { label: 'Medium', textColor: 'text-slate-600', pulse: false };
  }
  return { label: 'Low', textColor: 'text-slate-400', pulse: false };
};


const VibeBar = ({ metric, score, color }) => {
  const barColor = colorMap[color] || colorMap['purple'];
  const feedback = getScoreFeedback(score);

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <p className="text-sm font-semibold text-slate-700">{metric}</p>
        <p className={`text-xs ${feedback.textColor}`}>{feedback.label}</p>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3.5 shadow-inner">
        <div
          className={`h-3.5 rounded-full transition-all duration-700 ease-out ${feedback.pulse ? 'animate-pulse-glow' : ''}`}
          style={{
            width: `${score}%`,
            backgroundColor: barColor,
            color: barColor // For the pulse animation's currentColor
          }}
        ></div>
      </div>
    </div>
  );
};

export default VibeBar;
