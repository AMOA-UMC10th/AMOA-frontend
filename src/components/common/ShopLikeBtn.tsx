

import { useState } from 'react';
import { likeShop, unlikeShop, LikeApiError } from '../../data/like';

interface ShopLikeBtnProps {
  initialLiked: boolean;
  // shopId를 넘기면 실제 찜 등록/취소 요청까지 보낸다. (아트 쪽 ArtLikeBtn과 같은 방식)
  shopId?: number;
  size?: number;
  onToggle?: (liked: boolean) => void;
}

export default function ShopLikeBtn({
  initialLiked,
  shopId,
  size = 16,
  onToggle,
}: ShopLikeBtnProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    setIsSaved(next);
    setAnimateOut(false);
    setShowToast(true);

    setTimeout(() => {
      setAnimateOut(true);
    }, 1300);

    setTimeout(() => {
      setShowToast(false);
    }, 1800);

    onToggle?.(next);

    if (shopId !== undefined) {
      const request = next ? likeShop(shopId) : unlikeShop(shopId);
      request.catch((err) => {
        console.error(err);
        // 서버가 이미 원하는 상태라면(중복 찜/이미 취소됨) 화면을 되돌리지 않는다.
        if (err instanceof LikeApiError && err.status === 409) return;
        setLiked(!next);
        setIsSaved(!next);
        onToggle?.(!next);
      });
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        aria-label="샵 찜하기"
        className="text-gray-400 hover:text-red-500 pointer-events-auto transition-transform active:scale-125"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={liked ? '#FF007A' : 'none'}
          stroke={liked ? '#FF007A' : '#ADB0B5'}
          strokeWidth="2"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {showToast && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 rounded-full whitespace-nowrap z-50 transition-opacity duration-500 ease-out ${
            isSaved ? 'bg-[#F70071]' : 'bg-[#171B1C]'
          } ${animateOut ? 'opacity-0' : 'opacity-100'}`}
        >
          {isSaved ? '찜 목록에 저장되었어요' : '찜 목록에서 삭제되었어요'}
        </div>
      )}
    </div>
  );
}