// [E104] 찜한 샵 카드 (프로필, 샵명, 위치, 대표 아트 2열 그리드)

import { useNavigate } from 'react-router-dom';
import ShopLikeBtn from '../common/ShopLikeBtn';
import InstagramSafeImage from '../common/InstagramSafeImage';
import { ChevronRightSmallIcon } from '../../assets/icons';
import type { NailCard } from '../../data/mockupdata/nailData';

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

      <div className="grid grid-cols-2 gap-x-4 gap-y-7">
        {representativeArts.map((art) => {
          const badgeLabel = `${
            art.created_month ? `${parseInt(art.created_month.split('-')[1], 10)}월 ` : ''
          }${art.art_type === 'EVENT' ? '이벤트' : '이달아'}`;

          return (
            <button
              key={art.card_id}
              onClick={() => navigate(`/art/${art.card_id}`)}
              className="w-full text-left"
            >
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 bg-[#E9EBEE] pointer-events-none">
                <InstagramSafeImage url={art.instagram_url} />
              </div>
              <span className="mt-1.5 inline-block rounded bg-[#FFEEF6] px-1.5 py-0.5 text-[10px] font-bold text-[#F70071]">
                {badgeLabel}
              </span>
              <p className="mt-1 text-sm font-bold text-[#374553]">
                {art.min_price?.toLocaleString()}~{art.max_price?.toLocaleString()}원
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
