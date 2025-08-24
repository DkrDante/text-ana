import React from 'react';
import TypewriterText from './TypewriterText.jsx';

const FriendsTake = ({ status, explanation }) => {
  const styles = {
    "Healthy & Engaged": "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/20",
    "Potential Situationship": "bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-sky-500/20",
    "Friendzone Alert": "bg-indigo-500/20 text-indigo-300 border-indigo-400/50 shadow-indigo-500/20",
    "Relationship Disagreement": "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-500/20",
    "RED ALERT: You Messed Up": "bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-rose-500/20",
    "It's Complicated": "bg-gray-500/20 text-gray-300 border-gray-400/50 shadow-gray-500/20"
  };
  const defaultStyle = "bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-purple-500/20";

  return (
    <div className={`p-5 rounded-xl border-2 text-left mb-6 shadow-lg backdrop-blur-sm ring-1 ring-white/10 ${styles[status] || defaultStyle}`}>
      <p className="font-bold text-xl mb-2">{status || "Let's break it down..."}</p>
      <div className="text-sm font-medium leading-relaxed opacity-90">
        <TypewriterText
          text={explanation || "The signals are a little mixed here, let's look at the details."}
          speed={30}
          delay={500}
        />
      </div>
    </div>
  );
};

export default FriendsTake;
