// 공통 찜(좋아요) 버튼 - 하트 토글 + 토스트

import { useState } from 'react';
import { HeartIcon } from '../../assets/icons';
import { likeCard, unlikeCard, LikeApiError } from '../../data/like';
import { setCardLiked, useCardLiked } from '../../data/likeStore';

interface ArtLikeBtnProps {
  initialLiked: boolean;
  cardId?: number;
  size?: number;
  onToggle?: (liked: boolean) => void;
}

export default function ArtLikeBtn({
  initialLiked,
  cardId,
  size = 22,
  onToggle,
}: ArtLikeBtnProps) {
  // cardId가 있으면 공용 저장소를 따른다. 그래야 목록에서 누른 찜이 상세에도 반영된다.
  const [localLiked, setLocalLiked] = useState(initialLiked);
  const liked = useCardLiked(cardId, localLiked);

  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const setLiked = (value: boolean) => {
    if (cardId === undefined) setLocalLiked(value);
    else setCardLiked(cardId, value);
  };

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

    if (cardId !== undefined) {
      const request = next ? likeCard(cardId) : unlikeCard(cardId);
      request.catch((err) => {
        console.error(err);
        // 서버 상태가 이미 원하는 상태(중복 찜/이미 취소됨)라면 되돌리지 않고 그대로 둠
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