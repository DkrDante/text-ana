import { useEffect, useRef } from 'react';

export const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50, restraint = 100) => {
  const elementRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const distX = useRef(0);
  const distY = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      const touchobj = e.changedTouches[0];
      startX.current = touchobj.pageX;
      startY.current = touchobj.pageY;
    };

    const handleTouchEnd = (e) => {
      const touchobj = e.changedTouches[0];
      distX.current = touchobj.pageX - startX.current;
      distY.current = touchobj.pageY - startY.current;

      if (Math.abs(distX.current) >= threshold && Math.abs(distY.current) <= restraint) {
        if (distX.current > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (distX.current < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, restraint]);

  return elementRef;
};
