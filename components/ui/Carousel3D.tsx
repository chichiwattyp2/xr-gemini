import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Carousel3DProps {
  children: ReactNode[];
}

const Carousel3D: React.FC<Carousel3DProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMotionReduced, setIsMotionReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setIsMotionReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : children.length - 1));
  }, [children.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev < children.length - 1 ? prev + 1 : 0));
  }, [children.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center" style={{ perspective: '1000px' }}>
      <div className="relative w-full h-96 mb-4">
        {children.map((child, i) => {
          const offset = i - activeIndex;
          const isVisible = isMotionReduced ? offset === 0 : Math.abs(offset) < 3;

          // FIX: Explicitly type `style` as React.CSSProperties to fix pointerEvents type issue.
          const style: React.CSSProperties = isMotionReduced ? {
              transform: `translateX(${offset * 100}%)`,
              opacity: isVisible ? 1 : 0,
              zIndex: children.length - Math.abs(offset),
              pointerEvents: offset === 0 ? 'auto' : 'none',
              transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
            } : {
              transform: `
                translateX(${offset * 35}%) 
                translateZ(${Math.abs(offset) * -150}px) 
                rotateY(${offset * -15}deg)
              `,
              opacity: isVisible ? 1 : 0,
              zIndex: children.length - Math.abs(offset),
              pointerEvents: offset === 0 ? 'auto' : 'none',
            };

          return (
            <div
              key={i}
              className="absolute w-full h-full transition-all duration-500 ease-out"
              style={style}
            >
              <div className={cn("w-full h-full transition-transform duration-500", !isMotionReduced && offset !== 0 && "group-hover:scale-105")}>
                 {child}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center space-x-8 mt-4">
         <button
            onClick={goPrev}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-ring"
            aria-label="Previous slide"
          >
            <ChevronLeft />
        </button>
        <div className="flex space-x-2">
            {children.map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => setActiveIndex(i)} 
                    className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        i === activeIndex ? "bg-accent-blue scale-125" : "bg-gray-500 hover:bg-gray-400"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                />
            ))}
        </div>
        <button
            onClick={goNext}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-ring"
            aria-label="Next slide"
        >
            <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel3D;