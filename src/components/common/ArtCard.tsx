import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommonArtCardProps {
  cardId: number;
  instagramUrl: string;
  shopName: string;
  regionName: string;
  minPrice: number;
  maxPrice: number;
  artType: string;
  isLiked?: boolean;
}

function InstagramSafeImage({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const targetWidth = 326;
        if (width > 0) {
          setScale(width / targetWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!url || url.trim() === '') {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
        이미지가 없습니다.
      </div>
    );
  }

  const cleanUrl = url.split('?')[0];
  const embedUrl = `${cleanUrl}${cleanUrl.endsWith('/') ? '' : '/'}embed/?captioned=false`;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#E9EBEE]">
      <div
        className="absolute origin-top-left"
        style={{
          width: '326px',
          height: '480px',
          transform: `scale(${scale})`,
          top: 'px',
          left: '0px',
        }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 pointer-events-none"
          scrolling="no"
          title="Instagram Image"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function ArtCard({
  cardId,
  instagramUrl,
  shopName,
  regionName,
  minPrice,
  maxPrice,
  artType,
  isLiked = false,
}: CommonArtCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);

  const artMonth = new Date().getMonth() + 1;

  const handleCardClick = () => {
    navigate(`/art-detail/${cardId}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const getArtTypeLabel = (type: string) => {
    switch (type) {
      case 'MONTHLY':
        return '이달아';
      case 'EVENT':
        return '이벤트';
      default:
        return '아트';
    }
  };

  return (
    <div className="w-full cursor-pointer group" onClick={handleCardClick}>
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 pointer-events-none">
        <InstagramSafeImage url={instagramUrl} />
      </div>

        <div className="mt-2.5">
        <div className="flex items-center justify-between">
            <span className="text-[10px] bg-[#FFF0F6] text-[#374553] px-1.5 py-0.5 rounded font-bold">
            {artMonth}월 {getArtTypeLabel(artType)}
            </span>
            <button onClick={handleLikeClick} className="text-gray-400 hover:text-red-500 pointer-events-auto mr-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "#FF007A" : "none"} stroke={liked ? "#FF007A" : "#ADB0B5"} strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            </button>
        </div>

        <p className="text-sm font-bold text-[#28323C] group-hover:text-[#FF007A] transition-colors truncate mt-1">
            {shopName || '이름 없음'}
        </p>

        <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 21s-7-6.5-7-11.5a7 7 0 1114 0C19 14.5 12 21 12 21z"
                stroke="#ADB0B5"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" stroke="#ADB0B5" strokeWidth="2" />
            </svg>
            {regionName || '지역 정보 없음'}
        </p>

        <p className="text-xs text-[#646F7C] mt-1 font-semibold">
            {minPrice ? `${minPrice.toLocaleString()}원` : '0원'} ~{' '}
            {maxPrice ? `${maxPrice.toLocaleString()}원` : '0원'}
        </p>
        </div>
    </div>
  );
}