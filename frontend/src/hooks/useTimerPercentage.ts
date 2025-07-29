import { useState, useEffect } from 'react';

export const useTimerPercentage = (duration: number) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      if (diff >= duration) {
        setElapsed(duration);
        clearInterval(interval);
      } else {
        setElapsed(diff);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration]);

  return Math.min(100, Math.round((elapsed / duration) * 100));
};
