import React from 'react';

const FriendsTake = ({ status, explanation }) => {
  const styles = {
    "Healthy & Engaged": "bg-emerald-100 text-emerald-900 border-emerald-400",
    "Potential Situationship": "bg-sky-100 text-sky-900 border-sky-400",
    "Friendzone Alert": "bg-indigo-100 text-indigo-900 border-indigo-400",
    "Relationship Disagreement": "bg-amber-100 text-amber-900 border-amber-400",
    "RED ALERT: You Messed Up": "bg-rose-100 text-rose-900 border-rose-400",
    "It's Complicated": "bg-slate-100 text-slate-900 border-slate-400"
  };
  const defaultStyle = "bg-purple-100 text-purple-900 border-purple-400";

  return (
    <div className={`p-5 rounded-xl border-2 text-left mb-6 shadow-sm ${styles[status] || defaultStyle}`}>
      <p className="font-bold text-xl mb-2">{status || "Let's break it down..."}</p>
      <p className="text-sm font-medium leading-relaxed">{explanation || "The signals are a little mixed here, let's look at the details."}</p>
    </div>
  );
};

export default FriendsTake;

