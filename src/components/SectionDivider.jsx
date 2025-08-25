import React from 'react';

const SectionDivider = ({ label, gradient = false }) => {
  return (
    <div className="my-6 flex items-center">
      <div className={`flex-1 h-px ${gradient ? 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent' : 'bg-gray-600/30'}`}></div>
      {label && (
        <>
          <div className="mx-4">
            <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600/30 backdrop-blur-sm">
              {label}
            </span>
          </div>
          <div className={`flex-1 h-px ${gradient ? 'bg-gradient-to-r from-transparent via-blue-400/50 to-transparent' : 'bg-gray-600/30'}`}></div>
        </>
      )}
    </div>
  );
};

export default SectionDivider;
