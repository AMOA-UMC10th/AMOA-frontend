import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NailCard } from '../../data/naildata';

interface RecommendArtListProps {
  items: NailCard[];
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

function ArtCard({ item }: { item: NailCard }) {
  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/shop/${item.shop_name || 'unknown'}`);
  };

  const handleCardClick = () => {
    navigate(`/art-detail/${item.card_id}`);
  };

  const shopInitial = item.shop_name ? item.shop_name.substring(0, 1) : 'N';

  return (
    <div className="w-full cursor-pointer group" onClick={handleCardClick}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-5 h-5 rounded-full bg-[#E9EBEE] shrink-0 overflow-hidden flex items-center justify-center text-[10px] font-bold text-gray-500">
            {shopInitial}
          </span>
          <span className="text-xs text-[#646F7C] truncate">
            {item.shop_name || '이름 없음'}
          </span>
        </div>
        <button
          onClick={handleProfileClick}
          className="text-[10px] text-white bg-[#3B82F6] px-1.5 py-0.5 rounded shrink-0"
        >
          프로필 보기
        </button>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-gray-100 bg-[#E9EBEE] pointer-events-none">
        {item.instagram_url ? (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={item.instagram_url}
            data-instgrm-version="14"
            style={{ background: '#FFF', border: '0', borderRadius: '12px', margin: '0', width: '100%' }}
          />
        ) : (
          <div className="aspect-square flex items-center justify-center text-xs text-gray-400 bg-gray-100">
            이미지가 없습니다.
          </div>
        )}
      </div>

      <p className="mt-2 text-sm font-bold text-[#28323C] group-hover:text-[#FF007A] transition-colors">
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
      <p className="text-xs text-[#646F7C] mt-1 font-medium">
        {item.min_price?.toLocaleString() || 0}~{item.max_price?.toLocaleString() || 0}원
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
      {items?.map((item, index) => (
        <ArtCard key={item.card_id || `art-card-${index}`} item={item} />
      ))}
    </div>
  );
}