import React from 'react';

const Spinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center h-full text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
    <p className="text-purple-700 font-semibold">{text}</p>
  </div>
);

export default Spinner;

