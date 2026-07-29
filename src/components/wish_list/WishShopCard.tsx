// [E104] 찜한 샵 카드
//
// 설계서(샵 찜하기/취소):
// - 2번: 카드 하단에 해당 샵의 최신 등록 아트 카드를 가로 스크롤로 최대 5개까지 노출.
//        각 썸네일 하단에 아트 유형 배지 + 가격 범위
// - 3-1: 샵 카드 상단 행(샵명/위치/">" 아이콘) 탭 시 → 네일샵 상세로 이동
// - 3-2: 대표 아트 썸네일 탭 시 → 해당 아트 상세로 이동

import { useNavigate } from 'react-router-dom';
import ShopLikeBtn from '../common/ShopLikeBtn';
import InstagramSafeImage from '../common/InstagramSafeImage';
import { ChevronRightSmallIcon, AddressPinIcon } from '../../assets/icons';
import type { LikedShop } from '../../data/likeList';

const MAX_THUMBNAILS = 5;

interface WishShopCardProps {
  shop: LikedShop;
  onUnlike: (shopId: number) => void;
}

function toArtTypeLabel(artType: string): string {
  switch (artType) {
    case 'MONTHLY':
      return '이달아';
    case 'EVENT':
      return '이벤트';
    default:
      return '아트';
  }
}

export default function WishShopCard({ shop, onUnlike }: WishShopCardProps) {
  const navigate = useNavigate();

  const thumbnails = shop.cards.slice(0, MAX_THUMBNAILS);
  const goToShop = () => navigate(`/shop/${shop.shopId}`);

  return (
    <div className="flex flex-col gap-3">
      {/* 상단 행: 탭하면 네일샵 상세로 이동 (설계서 3-1) */}
      <div className="flex items-center justify-between gap-2 px-4">
        <button
          type="button"
          onClick={goToShop}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          {shop.profileImageUrl ? (
            <img
              src={shop.profileImageUrl}
              alt=""
              className="h-[30px] w-[30px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="h-[30px] w-[30px] shrink-0 rounded-full bg-[#FFEEF6]" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-bold text-[#171B1C]">
              {shop.shopName}
            </span>
            <span className="mt-0.5 flex items-center gap-0.5 text-xs text-[#ADB0B5]">
              <AddressPinIcon className="h-3 w-3 shrink-0" />
              {shop.regionName}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <ShopLikeBtn
            initialLiked
            size={18}
            onToggle={(liked) => {
              if (!liked) onUnlike(shop.shopId);
            }}
          />
          <button
            type="button"
            onClick={goToShop}
            aria-label={`${shop.shopName} 상세로 이동`}
          >
            <ChevronRightSmallIcon className="h-4 w-4 text-[#ADB0B5]" />
          </button>
        </div>
      </div>

      {/* 대표 아트: 가로 스크롤 (설계서 2번) */}
      {thumbnails.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {thumbnails.map((card) => (
            <button
              key={card.cardId}
              type="button"
              onClick={() => navigate(`/art-detail/${card.cardId}`)}
              className="w-[148px] shrink-0 text-left"
            >
              {/* InstagramSafeImage가 자체 클릭을 갖고 있어 부모 탭으로 넘기려면 막아둔다. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-gray-100 bg-[#E9EBEE] pointer-events-none">
                <InstagramSafeImage url={card.instagramUrl} />
              </div>

              <span className="mt-1.5 inline-block rounded bg-[#FFF0F6] px-1.5 py-0.5 text-[10px] font-bold text-[#374553]">
                {toArtTypeLabel(card.artType)}
              </span>

              <p className="mt-1 text-xs font-semibold text-[#646F7C]">
                {card.minPrice?.toLocaleString() ?? 0}~
                {card.maxPrice?.toLocaleString() ?? 0}원
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
