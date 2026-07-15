// [E104] 찜한 샵 카드 (프로필, 샵명, 위치, 대표 아트 가로 스크롤 썸네일)

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopLikeBtn from '../common/ShopLikeBtn';
import { ChevronRightSmallIcon } from '../../assets/icons';
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

interface WishShopCardProps {
  shopName: string;
  region: string;
  arts: NailCard[];
  onUnlike: (shopName: string) => void;
}

export default function WishShopCard({
  shopName,
  region,
  arts,
  onUnlike,
}: WishShopCardProps) {
  const navigate = useNavigate();
  const representativeArts = arts.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => window.instgrm?.Embeds.process(), 100);
    return () => clearTimeout(timer);
  }, [representativeArts]);

  const handleShopClick = () => navigate(`/shop/${shopName}`);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleShopClick}
          className="flex min-w-0 items-center gap-2"
        >
          <span className="h-[30px] w-[30px] shrink-0 rounded-full bg-[#E9EBEE]" />
          <span className="truncate text-[13px] font-bold text-[#171B1C]">
            {shopName}
          </span>
          <span className="shrink-0 text-xs text-[#ADB0B5]">{region}</span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <ShopLikeBtn
            initialLiked
            size={18}
            onToggle={(liked) => {
              if (!liked) onUnlike(shopName);
            }}
          />
          <button onClick={handleShopClick} aria-label="네일샵 상세로 이동">
            <ChevronRightSmallIcon className="h-4 w-4 text-[#ADB0B5]" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto [scrollbar-width:none]">
        {representativeArts.map((art) => {
          const badgeLabel = `${
            art.created_month ? `${parseInt(art.created_month.split('-')[1], 10)}월 ` : ''
          }${art.art_type === 'EVENT' ? '이벤트' : '이달아'}`;

          return (
            <button
              key={art.card_id}
              onClick={() => navigate(`/art/${art.card_id}`)}
              className="w-[104px] shrink-0 text-left"
            >
              <div className="h-[104px] w-full overflow-hidden rounded-xl border border-gray-100 bg-[#E9EBEE] pointer-events-none">
                {art.instagram_url && (
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={art.instagram_url}
                    data-instgrm-version="14"
                    style={{ background: '#FFF', border: '0', borderRadius: '12px', margin: '0', width: '100%' }}
                  />
                )}
              </div>
              <span className="mt-1.5 inline-block rounded bg-[#FFEEF6] px-1.5 py-0.5 text-[10px] font-bold text-[#F70071]">
                {badgeLabel}
              </span>
              <p className="text-xs font-medium text-[#374553]">
                {art.min_price?.toLocaleString()}~{art.max_price?.toLocaleString()}원
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
