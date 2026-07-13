// G101 필독 네일 트렌드 배너 (스와이프 캐러셀)

import { useState } from 'react';
import type { TrendSlide } from '../../data/homeData';

interface TrendBannerProps {
  slides: TrendSlide[];
}

export default function TrendBanner({ slides }: TrendBannerProps) {
  const [index, setIndex] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    (e.currentTarget as HTMLElement).dataset.startX = String(
      e.touches[0].clientX,
    );
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const startX = Number((e.currentTarget as HTMLElement).dataset.startX ?? 0);
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50 && index < slides.length - 1) {
      setIndex((prev) => prev + 1);
    } else if (diff < -50 && index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  if (slides.length === 0) return null;
  const current = slides[index];

  return (
    <div className="px-4 pt-4 pb-6">
      <h3 className="text-lg font-bold mb-3">
        <span className="text-[#FF1B82]">필독!</span>
        <span className="text-[#28323C]"> 놓치기 아쉬운 네일 트렌드 ✨</span>
      </h3>
      <div
        className="relative w-full aspect-[30/9] overflow-hidden bg-[#E9EBEE]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {index + 1}/{slides.length}
        </span>
        <p className="absolute bottom-4 left-4 right-4 text-white font-bold whitespace-pre-line">
          {current.title}
        </p>
      </div>
    </div>
  );
}
