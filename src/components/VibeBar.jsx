import React from 'react';

// Vibrant neon color mapping for dark theme
const colorMap = {
  rose: 'rgb(244 63 94)',
  amber: 'rgb(251 191 36)',
  sky: 'rgb(14 165 233)',
  emerald: 'rgb(16 185 129)',
  indigo: 'rgb(99 102 241)',
  purple: 'rgb(147 51 234)',
};

// Gradient mappings for enhanced visual appeal
const gradientMap = {
  rose: 'linear-gradient(90deg, rgb(244 63 94), rgb(236 72 153))',
  amber: 'linear-gradient(90deg, rgb(251 191 36), rgb(245 158 11))',
  sky: 'linear-gradient(90deg, rgb(14 165 233), rgb(6 182 212))',
  emerald: 'linear-gradient(90deg, rgb(16 185 129), rgb(5 150 105))',
  indigo: 'linear-gradient(90deg, rgb(99 102 241), rgb(129 140 248))',
  purple: 'linear-gradient(90deg, rgb(147 51 234), rgb(168 85 247))',
};

// Helper function to get qualitative feedback based on score
const getScoreFeedback = (score) => {
  if (score >= 90) {
    return { label: 'CRITICAL', textColor: 'text-red-400 font-extrabold', pulse: true };
  }
  if (score >= 70) {
    return { label: 'High', textColor: 'text-amber-400 font-bold', pulse: false };
  }
  if (score >= 30) {
    return { label: 'Medium', textColor: 'text-gray-300', pulse: false };
  }
  return { label: 'Low', textColor: 'text-gray-500', pulse: false };
};


const VibeBar = ({ metric, score, color }) => {
  const barColor = colorMap[color] || colorMap['purple'];
  const barGradient = gradientMap[color] || gradientMap['purple'];
  const feedback = getScoreFeedback(score);

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <p className="text-sm font-semibold text-gray-200">{metric}</p>
        <p className={`text-xs ${feedback.textColor}`}>{feedback.label}</p>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-4 shadow-inner border border-gray-600/30 backdrop-blur-sm">
        <div
          className={`h-4 rounded-full transition-all duration-700 ease-out shadow-lg ${feedback.pulse ? 'animate-pulse' : ''}`}
          style={{
            width: `${score}%`,
            background: barGradient,
            boxShadow: feedback.pulse ? `0 0 20px ${barColor}` : `0 2px 10px ${barColor}20`
          }}
        ></div>
      </div>
    </div>
  );
};

export default VibeBar;
