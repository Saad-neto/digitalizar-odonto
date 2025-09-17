import React, { useState, useEffect } from 'react';

interface CounterProps {
  targetNumber: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ 
  targetNumber, 
  duration = 2000, 
  suffix = "", 
  className = "" 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`counter-${targetNumber}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [targetNumber, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * targetNumber);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, targetNumber, duration]);

  return (
    <span 
      id={`counter-${targetNumber}`}
      className={`counter ${className}`}
    >
      {count.toLocaleString('pt-BR')}{suffix}
    </span>
  );
};

export default Counter;