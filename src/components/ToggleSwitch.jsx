import React from 'react';

const ToggleSwitch = ({ label, isEnabled, onToggle }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
        <div className={`block w-14 h-8 rounded-full transition-all duration-300 ${isEnabled ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-purple-500/25' : 'bg-gray-600/50 border border-gray-500/30'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 shadow-lg ${isEnabled ? 'transform translate-x-6 shadow-cyan-400/30' : 'shadow-gray-400/20'}`}></div>
      </div>
      <div className="ml-3 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{label}</div>
    </label>
  );
};

export default ToggleSwitch;
