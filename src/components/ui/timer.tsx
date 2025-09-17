import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  onExpire?: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  initialHours = 2,
  initialMinutes = 47,
  initialSeconds = 15,
  onExpire,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;
        
        if (totalSeconds <= 1) {
          onExpire?.();
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        const newTotal = totalSeconds - 1;
        return {
          hours: Math.floor(newTotal / 3600),
          minutes: Math.floor((newTotal % 3600) / 60),
          seconds: newTotal % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className="timer">
        {formatNumber(timeLeft.hours)}
      </span>
      <span className="text-success-light">:</span>
      <span className="timer">
        {formatNumber(timeLeft.minutes)}
      </span>
      <span className="text-success-light">:</span>
      <span className="timer">
        {formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
};

export default Timer;