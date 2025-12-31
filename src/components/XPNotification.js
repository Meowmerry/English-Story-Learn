import React, { useEffect, useState } from 'react';

const XPNotification = ({ xpChange, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (xpChange !== 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [xpChange, onComplete]);

  if (!isVisible || xpChange === 0) {
    return null;
  }

  const isPositive = xpChange > 0;

  return (
    <div
      className={`fixed top-20 right-4 z-50 animate-bounce-in ${
        isPositive ? 'bg-green-500' : 'bg-red-500'
      } text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}
    >
      <span className="text-2xl">{isPositive ? '✨' : '💔'}</span>
      <div>
        <p className="font-bold text-lg">
          {isPositive ? '+' : ''}{xpChange} XP
        </p>
        <p className="text-xs opacity-90">
          {isPositive ? 'Great job!' : 'Keep trying!'}
        </p>
      </div>
    </div>
  );
};

export default XPNotification;
