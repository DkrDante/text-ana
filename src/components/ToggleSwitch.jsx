
import React from 'react';

const ToggleSwitch = ({ label, isEnabled, onToggle }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${isEnabled ? 'bg-fuchsia-600' : 'bg-slate-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className="ml-3 text-sm font-medium text-slate-600">{label}</div>
    </label>
  );
};

export default ToggleSwitch;

