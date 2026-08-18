import { useEffect, useRef, useState } from 'react';
import { HeartIcon } from '../../assets/icons';
import { likeCard, unlikeCard, LikeApiError } from '../../data/like';
import { setCardLiked } from '../../data/likeStore';
import LikeToast from './LikeToast';
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
    // 같은 아트가 여러 화면(찜 목록/샵 안 캐러셀/상세)에 동시에 떠 있으므로
    // 로컬 state만 바꾸면 나머지 하트가 따라오지 않는다.
    if (cardId !== undefined) {
      setCardLiked(cardId, nextLiked);
    }
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
      setCardLiked(cardId, previousLiked);
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

      {showToast && <LikeToast saved={isSaved} fadingOut={animateOut} />}
    </div>
  );
}
