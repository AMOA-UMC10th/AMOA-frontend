import { useEffect, useRef, useState } from 'react';
import { likeShop, unlikeShop, LikeApiError } from '../../data/like';
import { setShopLiked } from '../../data/likeStore';
import LikeToast from './LikeToast';
import { useRequireLogin } from '../../hooks/useRequireLogin';

interface ShopLikeBtnProps {
  initialLiked: boolean;
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
    if (shopId !== undefined) {
      setShopLiked(shopId, nextLiked);
    }
    onToggle?.(nextLiked);
    showLikeToast(nextLiked);

    if (shopId === undefined) {
      return;
    }

    setIsRequesting(true);

    try {
      if (nextLiked) {
        await likeShop(shopId);
      } else {
        await unlikeShop(shopId);
      }
    } catch (error) {
      console.error('샵 찜 처리 실패:', error);

      if (error instanceof LikeApiError && error.status === 409) {
        return;
      }

      setLiked(previousLiked);
      setIsSaved(previousLiked);
      setShowToast(false);
      setShopLiked(shopId, previousLiked);
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

      {showToast && <LikeToast saved={isSaved} fadingOut={animateOut} />}
    </div>
  );
}
