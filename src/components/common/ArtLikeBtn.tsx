import { useEffect, useRef, useState } from 'react';
import { HeartIcon } from '../../assets/icons';
import { likeCard, unlikeCard, LikeApiError } from '../../data/like';
import { useRequireLogin } from '../../hooks/useRequireLogin';

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
  const { requireLogin } = useRequireLogin();

  const [liked, setLiked] = useState(initialLiked);
  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(initialLiked);
  const [animateOut, setAnimateOut] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLiked(initialLiked);
    setIsSaved(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }

      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const showLikeToast = (saved: boolean) => {
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
    }

    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }

    setIsSaved(saved);
    setAnimateOut(false);
    setShowToast(true);

    fadeTimerRef.current = window.setTimeout(() => {
      setAnimateOut(true);
    }, 1300);

    hideTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
    }, 1800);
  };

  const handleClick = async () => {
    if (!requireLogin()) {
      return;
    }

    if (isRequesting) {
      return;
    }

    const previousLiked = liked;
    const nextLiked = !previousLiked;

    setLiked(nextLiked);
    onToggle?.(nextLiked);
    showLikeToast(nextLiked);

    if (cardId === undefined) {
      return;
    }

    setIsRequesting(true);

    try {
      if (nextLiked) {
        await likeCard(cardId);
      } else {
        await unlikeCard(cardId);
      }
    } catch (error) {
      console.error('아트 찜 처리 실패:', error);

      if (error instanceof LikeApiError && error.status === 409) {
        return;
      }

      setLiked(previousLiked);
      setIsSaved(previousLiked);
      setShowToast(false);
      onToggle?.(previousLiked);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={isRequesting}
        aria-label="찜하기"
        className="transition-transform active:scale-125 flex items-center justify-center"
      >
        <span
          style={{ width: size, height: size }}
          className="flex items-center justify-center -mt-1"
        >
          {HeartIcon({
            className: 'w-full h-full block',
            filled: liked,
          })}
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
