import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type CarouselProps = {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  itemWidth?: number;
  itemHeight?: number;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  stopOnClick?: boolean;
};

export const Carousel: React.FC<CarouselProps> = ({
  items,
  className,
  itemClassName,
  itemHeight = 200,
  showArrows = false,
  showDots = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  stopOnClick = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) {
        setCurrentIndex(items.length - 1);
      } else if (index >= items.length) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index);
      }
    },
    [items]
  );

  const nextSlide = () => goTo(currentIndex + 1);
  const handleClickNextSlide = () => {
    nextSlide();
    if (stopOnClick) {
      setIsPlaying(false);
    }
  };
  const prevSlide = () => goTo(currentIndex - 1);
  const handleClickPrevSlide = () => {
    prevSlide();
    if (stopOnClick) {
      setIsPlaying(false);
    }
  };

  const handleDotClick = (index: number) => {
    goTo(index);
    if (stopOnClick) {
      setIsPlaying(false);
    }
  };

  // Визначаємо ширину контейнера
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();

    // Слідкуємо за ресайзом
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Автоплей
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, autoPlayInterval]);

  return (
    <div
      ref={containerRef}
      className={classNames('relative overflow-hidden w-full', className)}
      style={{ height: itemHeight }}
    >
      {/* Елементи */}
      <div
        className="flex transition-transform duration-500"
        style={{
          width: `${items.length * 100}%`,
          transform: `translateX(-${currentIndex * containerWidth}px)`,
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className={classNames('flex-shrink-0', itemClassName)}
            style={{ width: containerWidth, height: itemHeight }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Стрілки */}
      {showArrows && (
        <>
          <button
            onClick={handleClickPrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background-secondary text-primary px-2 py-1 rounded hover:bg-background-secondary-hover cursor-pointer"
          >
            <FontAwesomeIcon icon="arrow-left" />
          </button>
          <button
            onClick={handleClickNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background-secondary text-primary px-2 py-1 rounded hover:bg-background-secondary-hover cursor-pointer"
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        </>
      )}

      {/* Точки */}
      {showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={classNames(
                'w-2 h-2 rounded-full transition-colors cursor-pointer',
                idx === currentIndex ? 'bg-primary' : 'bg-primary-disabled'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
