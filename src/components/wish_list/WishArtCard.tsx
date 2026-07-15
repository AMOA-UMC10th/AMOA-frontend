// [E102] 찜한 아트 카드 (이미지, 아트명, 샵명, 위치, 가격 + 하트 아이콘)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtLikeBtn from '../common/ArtLikeBtn';
import type { NailCard } from '../../data/nailData';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface WishArtCardProps {
  card: NailCard;
  onUnlike: (cardId: number) => void;
}

export default function WishArtCard({ card, onUnlike }: WishArtCardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => window.instgrm?.Embeds.process(), 100);
    return () => clearTimeout(timer);
  }, [card.instagram_url]);

  const badgeLabel = `${
    card.created_month ? `${parseInt(card.created_month.split('-')[1], 10)}월 ` : ''
  }${card.art_type === 'EVENT' ? '이벤트' : '이달아'}`;

  return (
    <article
      className="w-full cursor-pointer"
      onClick={() => navigate(`/art/${card.card_id}`)}
    >
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 bg-[#E9EBEE] pointer-events-none">
        {card.instagram_url && (
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={card.instagram_url}
            data-instgrm-version="14"
            style={{ background: '#FFF', border: '0', borderRadius: '12px', margin: '0', width: '100%' }}
          />
        )}
      </div>

      <div className="relative pt-2">
        <span className="inline-flex rounded bg-[#FFEEF6] px-1.5 py-0.5 text-[10px] font-bold text-[#F70071]">
          {badgeLabel}
        </span>
        <span
          className="absolute right-0 top-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ArtLikeBtn
            initialLiked
            size={18}
            onToggle={(liked) => {
              if (!liked) onUnlike(card.card_id);
            }}
          />
        </span>
        <h2 className="mt-1.5 truncate text-sm font-bold text-[#171B1C]">
          {card.shop_name}
        </h2>
        <p className="mt-0.5 flex items-center gap-0.5 text-xs text-[#ADB0B5]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-6.5-7-11.5a7 7 0 1114 0C19 14.5 12 21 12 21z"
              stroke="#ADB0B5"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" stroke="#ADB0B5" strokeWidth="2" />
          </svg>
          {card.region_name}
        </p>
        <p className="mt-1 text-sm font-bold text-[#374553]">
          {card.min_price?.toLocaleString()}~{card.max_price?.toLocaleString()}원
        </p>
      </div>
    </article>
  );
}
