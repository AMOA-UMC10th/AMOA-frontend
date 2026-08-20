import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrendSlide } from '../../data/home';
import trendBannerImg from '../../assets/trendBanner.png';

interface TrendBannerProps {
  slides: TrendSlide[];
}

export default function TrendBanner({ slides }: TrendBannerProps) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

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

  const handleBannerClick = () => {
    navigate(`/trend/${current.id}`);
  };

  return (
    <div className="py-3 pb-6">
      <h3 className="text-lg font-semibold mb-3 px-4">
        <span className="text-[#FF007A]">필독!</span>
        <span className="text-[#28323C]"> 놓치기 아쉬운 네일 트렌드 ✨</span>
      </h3>
      <div
        className="relative w-full aspect-[360/238] overflow-hidden bg-[#E9EBEE] cursor-pointer"
        onClick={handleBannerClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={trendBannerImg}
          alt={current.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-0"></div>
        <span className="absolute bottom-4 right-3 bg-white/50 text-black/70 text-xs px-3 py-1 rounded-full z-10">
          {index + 1}/{slides.length}
        </span>

        <div className="absolute bottom-4 left-4 right-16 z-10 text-white">
          <p className="font-semibold text-lg leading-snug whitespace-pre-line py-0.8">
            {current.title}
          </p>
          <p className="text-xs text-white/80 mt-1 font-normal">
            감도 높은 디자인으로 분위기 변신
          </p>
        </div>
      </div>
    </div>
  );
}