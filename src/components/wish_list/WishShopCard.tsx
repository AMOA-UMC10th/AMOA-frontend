// [E104] 찜한 샵 블록

import { useNavigate } from 'react-router-dom';
import ShopLikeBtn from '../common/ShopLikeBtn';
import ArtCard from '../common/ArtCard';
import { AddressPinIcon, ChevronRightSmallIcon } from '../../assets/icons';
import type { LikedShop } from '../../data/likeList';

interface WishShopCardProps {
  shop: LikedShop;
  onUnlike: (shopId: number) => void;
}

export default function WishShopCard({ shop, onUnlike }: WishShopCardProps) {
  const navigate = useNavigate();

  const handleShopClick = () => navigate(`/shop/${shop.shopId}`);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-[35px] w-[35px] shrink-0 rounded-full bg-[#FFEEF6]" />
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShopClick}
                className="truncate text-[13px] font-bold text-[#171B1C]"
              >
                {shop.shopName}
              </button>
              <div className="translate-y-0.5">
                <ShopLikeBtn
                  initialLiked
                  shopId={shop.shopId}
                  size={15}
                  onToggle={(liked) => {
                    if (!liked) onUnlike(shop.shopId);
                  }}
                />
              </div>
            </div>
            
            <p className="-mt-0.5 flex items-center gap-0.5 text-xs text-[#ADB0B5]">
              <AddressPinIcon className="h-3.5 w-3.5 text-[#ADB0B5]" />
              {shop.regionName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleShopClick}
          aria-label="네일샵 상세로 이동"
          className="shrink-0"
        >
          <ChevronRightSmallIcon className="h-4 w-4 text-[#ADB0B5]" />
        </button>
      </div>

      <div className="flex gap-0.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shop.cards.map((art) => (
          <div key={art.cardId} className="w-[47%] shrink-0">
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
