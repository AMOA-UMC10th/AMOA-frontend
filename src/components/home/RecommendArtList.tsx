import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NailCard } from '../../data/nailData';

interface RecommendArtListProps {
  items: NailCard[];
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
        top: '-32px', 
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

function ArtCard({ item }: { item: NailCard }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/art-detail/${item.card_id}`);
  };

  return (
    <div className="w-full cursor-pointer group" onClick={handleCardClick}>
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-gray-100 pointer-events-none">
        <InstagramSafeImage url={item.instagram_url} />
      </div>

      <p className="mt-2 text-sm font-bold text-[#28323C] group-hover:text-[#FF007A] transition-colors truncate">
        {item.shop_name || '이름 없음'}
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
        {item.region_name || '지역 정보 없음'}
      </p>
      <p className="text-xs text-[#646F7C] mt-1 font-semibold">
        {item.min_price ? `${item.min_price.toLocaleString()}원` : '0원'} ~{' '}
        {item.max_price ? `${item.max_price.toLocaleString()}원` : '0원'}
      </p>
    </div>
  );
}

export default function RecommendArtList({ items }: RecommendArtListProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-4 pb-4">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <ArtCard key={item.card_id || `art-card-${index}`} item={item} />
        ))
      ) : (
        <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
          추천해 드릴 아트를 찾지 못했습니다.
        </div>
      )}
    </div>
  );
}