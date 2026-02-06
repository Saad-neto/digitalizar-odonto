import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: Date;
  daysFromNow?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  daysFromNow = 7 // Padrão: 7 dias a partir de agora
}) => {
  // Se não tiver targetDate, calcula baseado em daysFromNow
  const getTargetDate = () => {
    if (targetDate) return targetDate;

    const now = new Date();
    const target = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    return target;
  };

  const calculateTimeLeft = () => {
    const difference = getTargetDate().getTime() - new Date().getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, daysFromNow]);

  if (timeLeft.expired) {
    return null; // Não mostra nada se expirou
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' }
  ];

  return (
    <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Icon e Texto */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs md:text-sm font-medium text-white/90">
              Oferta expira em:
            </p>
            <p className="text-sm md:text-base font-bold text-white">
              Não perca essa chance!
            </p>
          </div>
        </div>

        {/* Countdown Display */}
        <div className="flex items-center gap-2 md:gap-3">
          {timeUnits.map((unit, index) => (
            <React.Fragment key={unit.label}>
              {/* Time Box */}
              <div className="flex flex-col items-center">
                <div className="bg-white text-medical-600 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px] md:min-w-[70px] shadow-md">
                  <div className="text-2xl md:text-3xl font-bold leading-none tabular-nums">
                    {String(unit.value).padStart(2, '0')}
                  </div>
                </div>
                <div className="text-xs md:text-sm font-medium text-white/90 mt-1">
                  {unit.label}
                </div>
              </div>

              {/* Separator (except last) */}
              {index < timeUnits.length - 1 && (
                <div className="text-2xl md:text-3xl font-bold text-white/60 pb-6">
                  :
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Urgency Message */}
      <div className="mt-4 text-center">
        <p className="text-xs md:text-sm text-white/80 font-medium">
          🔥 Apenas <span className="font-bold text-yellow-300">3 vagas restantes</span> no programa beta
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
