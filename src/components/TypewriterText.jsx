import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 50, delay = 0, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, delay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-cyan-400">|</span>
      )}
    </span>
  );
};

export default TypewriterText;
