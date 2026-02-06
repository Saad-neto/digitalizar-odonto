import { useEffect, useCallback, useState } from 'react';

/**
 * Optimized scroll hook with throttling
 * Reduces scroll event frequency to improve performance
 */
export function useOptimizedScroll(callback: (scrollY: number) => void, throttleMs: number = 100) {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
    callback(window.scrollY);
  }, [callback]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastScrollY = window.scrollY;

    const throttledScroll = () => {
      const currentScrollY = window.scrollY;

      // Only update if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY) < 5) return;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastScrollY = currentScrollY;
        handleScroll();
      }, throttleMs);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleScroll, throttleMs]);

  return scrollY;
}

/**
 * Debounced window resize hook
 * Prevents excessive re-renders on window resize
 */
export function useOptimizedResize(callback: (width: number, height: number) => void, debounceMs: number = 150) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        callback(window.innerWidth, window.innerHeight);
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [callback, debounceMs]);
}
