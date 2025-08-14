
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center font-mono bg-black bg-opacity-20 p-4 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
      <div className="text-6xl md:text-9xl font-bold tracking-widest text-cyan-300" style={{ textShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
        {formatTime(currentDate)}
      </div>
      <div className="mt-4 text-xl md:text-2xl text-gray-300/80 tracking-wide">
        {formatDate(currentDate)}
      </div>
    </div>
  );
};

export default Clock;
