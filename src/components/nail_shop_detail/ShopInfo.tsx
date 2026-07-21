import { alarm, call_end, location_on } from "../../assets/icons";
import type { ShopDetailResult } from "../../data/shopData";
import ShopLikeBtn from "../common/ShopLikeBtn";

interface ShopInfoProps {
  shop: ShopDetailResult;
}

export default function ShopInfo({ shop }: ShopInfoProps) {
  const formatLikeCount = (count: number) => {
    if (count >= 10000) {
      return `${Math.floor(count / 10000)}만`;
    }
    return count.toLocaleString();
  };

  const shopInitial = shop.shop_name.substring(0, 2);

  return (
    <div className="w-full bg-white">
      <div className="px-6 pt-6 pb-5 relative">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-pink-200 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {shop.profile_image_url ? (
                <img
                  src={shop.profile_image_url}
                  alt={shop.shop_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                shopInitial
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold" style={{ color: "#28323C" }}>
                {shop.shop_name}
              </h1>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {shop.designtags.map((tag) => (
                  <span
                    key={tag.designtag_id}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: "#FFEFF6", color: "#FF007A" }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#ADB0B5] w-4 h-4 flex items-center justify-center shrink-0">
                    {location_on({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ADB0B5] w-4 h-4 flex items-center justify-center shrink-0">
                    {call_end({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.shop_phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ADB0B5] w-4 h-4 flex items-center justify-center shrink-0">
                    {alarm({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.business_hours}</span>
                </div>
              </div>
            </div>
          </div>

          <ShopLikeBtn
            initialLiked={shop.is_liked}
            size={24}
            onToggle={(liked) => {
            }}
        />
        </div>
      </div>

      <div
        className="grid grid-cols-2"
        style={{
          height: "72px",
          borderTop: "1px solid #efefef",
          borderBottom: "1.5px solid #efefef",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs font-medium" style={{ color: "#ADB0B5" }}>아트찜</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "#28323C" }}>
            {formatLikeCount(shop.card_like_count)}
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center"
          style={{ borderLeft: "1.5px solid #EDEDED" }}
        >
          <p className="text-xs font-medium" style={{ color: "#ADB0B5" }}>샵찜</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "#28323C" }}>
            {formatLikeCount(shop.shop_like_count)}
          </p>
        </div>
      </div>
    </div>
  );
}