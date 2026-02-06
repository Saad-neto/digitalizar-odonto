import { useState, useEffect, useRef, ImgHTMLAttributes, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  threshold?: number;
  className?: string;
  /**
   * Enable WebP format with automatic fallback to original format
   * If true, will try to load .webp version first, then fallback to original
   */
  useWebP?: boolean;
}

/**
 * LazyImage component with Intersection Observer and WebP support
 * - Loads images only when they enter the viewport
 * - Automatically uses WebP format when available (90% smaller)
 * - Falls back to original format for browser compatibility
 * - Memoized to prevent unnecessary re-renders
 */
const LazyImageComponent = ({
  src,
  alt,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3C/svg%3E',
  threshold = 0.1,
  className,
  useWebP = true,
  ...props
}: LazyImageProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const pictureRef = useRef<HTMLPictureElement>(null);

  // Generate WebP source from original src
  const getWebPSrc = (originalSrc: string): string => {
    if (!useWebP || !originalSrc) return originalSrc;

    // Replace extension with .webp
    return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);

  useEffect(() => {
    // Use native lazy loading as primary strategy
    if ('loading' in HTMLImageElement.prototype) {
      setShouldLoad(true);
      return;
    }

    // Use Intersection Observer for older browsers
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            if (pictureRef.current) {
              observer.unobserve(pictureRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Start loading slightly before visible
      }
    );

    if (pictureRef.current) {
      observer.observe(pictureRef.current);
    }

    return () => {
      if (pictureRef.current) {
        observer.unobserve(pictureRef.current);
      }
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  // If shouldn't load yet, show fallback
  if (!shouldLoad) {
    return (
      <picture ref={pictureRef} className={className}>
        <img
          src={fallback}
          alt={alt}
          className={cn('opacity-0', className)}
          {...props}
        />
      </picture>
    );
  }

  return (
    <picture ref={pictureRef}>
      {/* WebP source - browsers that support it will use this (smaller file) */}
      {useWebP && webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}

      {/* Fallback to original format (PNG/JPG) for older browsers */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded && !isError ? 'opacity-100' : 'opacity-0',
          isError && 'bg-gray-200',
          className
        )}
        {...props}
      />
    </picture>
  );
};

// Memoize component to prevent re-renders when props don't change
export const LazyImage = memo(LazyImageComponent);

export default LazyImage;
