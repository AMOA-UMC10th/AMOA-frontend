import { alarm, call_end, AddressPinIcon, star } from "../../assets/icons";
import type { ShopDetail } from "../../data/shop"; // 새 타입 불러오기
import ShopLikeBtn from "../common/ShopLikeBtn";

interface ShopInfoProps {
  shop: ShopDetail;
}

export default function ShopInfo({ shop }: ShopInfoProps) {
  const formatLikeCount = (count: number) => {
    if (count >= 10000) {
      return `${Math.floor(count / 10000)}만`;
    }
    return count.toLocaleString();
  };

  return (
    <div className="w-full bg-white">
      <div className="px-6 pt-6 pb-5 relative">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-bold" style={{ color: "#28323C" }}>
                  {shop.shopName}
                </h1>
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  {star({ className: "w-full h-full" })}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {shop.designtags.map((tag) => (
                  <span
                    key={tag.designtagId}
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
                    {AddressPinIcon({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ADB0B5] w-4 h-4 flex items-center justify-center shrink-0">
                    {call_end({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.shopPhoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ADB0B5] w-4 h-4 flex items-center justify-center shrink-0">
                    {alarm({ className: "w-full h-full" })}
                  </span>
                  <span style={{ color: "#ADB0B5" }}>{shop.businessHours}</span>
                </div>
              </div>
            </div>
          </div>

          <ShopLikeBtn
            initialLiked={shop.isLiked}
            size={22}
            onToggle={(liked) => {
              // TODO: 샵 좋아요 클릭 이벤트 처리
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
            {formatLikeCount(shop.cardLikeCount)}
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center"
          style={{ borderLeft: "1.5px solid #EDEDED" }}
        >
          <p className="text-xs font-medium" style={{ color: "#ADB0B5" }}>샵찜</p>
          <p className="text-lg font-semibold mt-1" style={{ color: "#28323C" }}>
            {formatLikeCount(shop.shopLikeCount)}
          </p>
        </div>
      </div>
    </div>
  );
}