import { useState } from 'react';

interface ShopLikeBtnProps {
  initialLiked: boolean;
  size?: number;
  onToggle?: (liked: boolean) => void;
}

export default function ShopLikeBtn({
  initialLiked,
  size = 16,
  onToggle,
}: ShopLikeBtnProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    setIsSaved(next);
    // TODO: POST/DELETE /api/v1/shops/{shop_id}/likes
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
    onToggle?.(next);
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
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 text-white text-sm px-4 py-2 rounded-full whitespace-nowrap z-50 ${
            isSaved ? 'bg-[#F70071]' : 'bg-[#171B1C]'
          }`}
        >
          {isSaved ? '찜 목록에 저장되었어요' : '찜 목록에서 삭제되었어요'}
        </div>
      )}
    </div>
  );
}