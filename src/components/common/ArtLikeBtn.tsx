// 공통 찜(좋아요) 버튼 - 하트 토글 + 토스트

import { useState } from 'react';
import { HeartIcon } from '../../assets/icons';

interface ArtLikeBtnProps {
  initialLiked: boolean;
  size?: number;
  onToggle?: (liked: boolean) => void;
}

export default function ArtLikeBtn({
  initialLiked,
  size = 22,
  onToggle,
}: ArtLikeBtnProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    const next = !liked;
    setLiked(next);
    setIsSaved(next);
    // TODO: POST/DELETE /api/v1/cards/{card_id}/likes
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
    onToggle?.(next);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        aria-label="찜하기"
        className="transition-transform active:scale-125 flex items-center justify-center"
      >
        <span
          style={{ width: size, height: size }}
          className="flex items-center justify-center -mt-1"
        >
          {HeartIcon({ className: 'w-full h-full block', filled: liked })}
        </span>
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
