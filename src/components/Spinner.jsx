import React from 'react';

const Spinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 border-r-2 border-r-purple-400 mb-4 shadow-lg shadow-cyan-400/20"></div>
    <p className="text-gray-200 font-semibold">{text}</p>
  </div>
);

export default Spinner;
