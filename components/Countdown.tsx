
import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons';

interface CountdownProps {
  expirationDate: Date | null;
}

const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return { hours: '00', minutes: '00', seconds: '00' };
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
    };
};


const Countdown: React.FC<CountdownProps> = ({ expirationDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    if (!expirationDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = expirationDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft(formatTimeLeft(difference));
      } else {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  if (!expirationDate) return null;

  return (
    <div className="my-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center space-x-4">
      <ClockIcon className="w-6 h-6 text-cyan-400" />
      <p className="text-slate-300">
        Photos expire in: <span className="font-mono text-lg text-white font-bold">{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
      </p>
    </div>
  );
};

export default Countdown;
