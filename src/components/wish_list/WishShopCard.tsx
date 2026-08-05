// [E104] 찜한 샵 블록
// 설계서: 샵 이름 옆에 찜 하트, 그 아래 지역, 우측에 상세 이동 화살표.
// 대표 아트는 2열 그리드가 아니라 가로 스크롤로 늘어놓는다.

import { useNavigate } from 'react-router-dom';
import ShopLikeBtn from '../common/ShopLikeBtn';
import ArtCard from '../common/ArtCard';
import { AddressPinIcon, ChevronRightSmallIcon } from '../../assets/icons';
import type { LikedShop } from '../../data/likeList';

interface WishShopCardProps {
  shop: LikedShop;
  // 하트를 끄면 목록에서 바로 뺀다. (요청 자체는 ShopLikeBtn 안에서 보낸다)
  onUnlike: (shopId: number) => void;
}

export default function WishShopCard({ shop, onUnlike }: WishShopCardProps) {
  const navigate = useNavigate();

  const handleShopClick = () => navigate(`/shop/${shop.shopId}`);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 px-4">
        <div className="flex min-w-0 items-start gap-2">
          <span className="h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full bg-[#FFEEF6]">
            {shop.profileImageUrl && (
              <img
                src={shop.profileImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShopClick}
                className="truncate text-[13px] font-bold text-[#171B1C]"
              >
                {shop.shopName}
              </button>
              <ShopLikeBtn
                initialLiked
                shopId={shop.shopId}
                size={16}
                onToggle={(liked) => {
                  if (!liked) onUnlike(shop.shopId);
                }}
              />
            </div>
            <p className="mt-0.5 flex items-center gap-0.5 text-xs text-[#ADB0B5]">
              <AddressPinIcon className="h-3.5 w-3.5 text-[#ADB0B5]" />
              {shop.regionName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleShopClick}
          aria-label="네일샵 상세로 이동"
          className="shrink-0 pt-1"
        >
          <ChevronRightSmallIcon className="h-4 w-4 text-[#ADB0B5]" />
        </button>
      </div>

      {/* 대표 아트는 가로로 넘겨서 본다. 마지막 카드가 살짝 잘려 보이도록 오른쪽 여백을 준다.
          카드 자체는 아트 탭/홈과 같은 공통 ArtCard를 그대로 쓴다. */}
      <div className="flex gap-0.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shop.cards.map((art) => (
          <div key={art.cardId} className="w-[47%] shrink-0">
            {/* 샵 응답의 아트에는 샵 이름/지역이 없어서 바깥 샵 정보를 그대로 내려준다. */}
            <ArtCard
              cardId={art.cardId}
              instagramUrl={art.instagramUrl}
              shopName={shop.shopName}
              regionName={shop.regionName}
              minPrice={art.minPrice}
              maxPrice={art.maxPrice}
              artType={art.artType}
              createdMonth={art.createdMonth}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
