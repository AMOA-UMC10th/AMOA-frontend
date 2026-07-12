//G101 맞춤 추천 아트 카드 리스트

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RecommendArt {
  id: string;
  shopId: string;
  shopUsername: string;
  shopProfileImage: string;
  shopName: string;
  location: string;
  priceRange: string;
  imageUrls: string[];
}

interface RecommendArtListProps {
  items: RecommendArt[];
}

function ArtCard({ item }: { item: RecommendArt }) {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const hasMultiple = item.imageUrls.length > 1;

  const handleProfileClick = () => {
    // TODO: D101(네일샵 상세 페이지)가 merge되면 실제 라우트로 연결
    navigate(`/shop/${item.shopId}`);
  };

  const showPrev = () => {
    setImageIndex((prev) =>
      prev === 0 ? item.imageUrls.length - 1 : prev - 1,
    );
  };
  const showNext = () => {
    setImageIndex((prev) =>
      prev === item.imageUrls.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="w-40 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-5 h-5 rounded-full bg-[#E9EBEE] shrink-0 overflow-hidden">
            {item.shopProfileImage && (
              <img
                src={item.shopProfileImage}
                alt={item.shopUsername}
                className="w-full h-full object-cover"
              />
            )}
          </span>
          <span className="text-xs text-[#646F7C] truncate">
            {item.shopUsername}
          </span>
        </div>
        <button
          onClick={handleProfileClick}
          className="text-[10px] text-white bg-[#3B82F6] px-1.5 py-0.5 rounded shrink-0"
        >
          프로필 보기
        </button>
      </div>

      <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-[#E9EBEE]">
        <img
          src={item.imageUrls[imageIndex]}
          alt={item.shopName}
          className="w-full h-full object-cover"
        />
        {hasMultiple && (
          <>
            <button
              onClick={showPrev}
              aria-label="이전 이미지"
              className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#28323C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={showNext}
              aria-label="다음 이미지"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="#28323C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <p className="mt-2 text-sm font-bold text-[#28323C]">{item.shopName}</p>
      <p className="text-xs text-[#ADB0B5] flex items-center gap-0.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7-6.5-7-11.5a7 7 0 1114 0C19 14.5 12 21 12 21z"
            stroke="#ADB0B5"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9.5" r="2.5" stroke="#ADB0B5" strokeWidth="2" />
        </svg>
        {item.location}
      </p>
      <p className="text-xs text-[#646F7C]">{item.priceRange}</p>
    </div>
  );
}

export default function RecommendArtList({ items }: RecommendArtListProps) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {items.map((item) => (
        <ArtCard key={item.id} item={item} />
      ))}
    </div>
  );
}
