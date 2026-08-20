import { useEffect, useRef, useState } from 'react';
import { HeartIcon } from '../../assets/icons';
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
        className="transition-transform active:scale-125 flex items-center justify-center pointer-events-auto"
      >
        <span
          style={{ width: size, height: size }}
          className="flex items-center justify-center"
        >
          {HeartIcon({
            className: 'w-[35px] h-[35px] block',
            filled: liked,
          })}
        </span>
      </button>

      {showToast && <LikeToast saved={isSaved} fadingOut={animateOut} />}
    </div>
  );
}