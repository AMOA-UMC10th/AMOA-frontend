import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeftIcon,
  AddressPinIcon,
  ChevronRightSmallIcon,
} from '../assets/icons';
import trendBannerImg from '../assets/trendBanner.png';
import trend2Img from '../assets/trend_2.png';
import trend3Img from '../assets/trend_3.png';
import ArtCard from '../components/common/ArtCard';
import ShopLikeBtn from '../components/common/ShopLikeBtn';
import { useShopLiked } from '../data/likeStore';
import { authFetchCards, type RecommendedCard } from '../data/card';

interface TrendShopGroup {
  shopId: number;
  shopName: string;
  location: string;
  isLiked?: boolean;
  arts: RecommendedCard[];
}

export default function TrendDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [shopDataList, setShopDataList] = useState<TrendShopGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const TARGET_SHOP_NAMES = ['아보카도네일', '샤네일']; // 13번, 20번 샵의 실제 이름을 적어주세요.

useEffect(() => {
  async function loadTrendData() {
    try {
      setLoading(true);
      const res = await authFetchCards({ size: 30 });
      const rawCards: any[] = (res as any)?.cards || (res as any)?.result?.cards || [];

      const filteredCards = rawCards.filter((card) =>
        TARGET_SHOP_NAMES.includes(card.shopName)
      );

      const groupedMap = new Map<string, RecommendedCard[]>();
      filteredCards.forEach((card) => {
        const key = card.shopName;
        if (!groupedMap.has(key)) {
          groupedMap.set(key, []);
        }
        groupedMap.get(key)!.push(card);
      });

      const groupedList: TrendShopGroup[] = Array.from(
        groupedMap.entries()
      ).map(([shopName, arts], index) => ({
        shopId: (arts[0] as any)?.shopId || index + 13,
        shopName,
        location: arts[0]?.regionName || (arts[0] as any)?.address || '지역 정보 없음',
        isLiked: false,
        arts,
      }));

      setShopDataList(groupedList);
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  loadTrendData();
}, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [shopDataList]);

  return (
    <div className="w-full min-h-screen bg-white pb-12">
      <div className="sticky top-0 z-30 flex items-center h-12 px-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-[#28323C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full aspect-[360/280] overflow-hidden bg-gray-100">
        <img
          src={trendBannerImg}
          alt="네일 모음"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-5 right-5 text-white">
          <h1 className="text-xl font-bold leading-tight drop-shadow-sm">
            조금은 색다른 분위기를 원해?
            <br />
            레이스 네일 모음 Zip.
          </h1>
          <p className="text-xs text-white/90 mt-1.5 font-light">
            감도 높은 디자인으로 분위기 변신
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="relative w-full aspect-[360/450] overflow-hidden bg-gray-100">
          <img
            src={trend2Img}
            alt="트렌드 이미지 1"
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="relative w-full aspect-[360/450] overflow-hidden bg-gray-100">
          <img
            src={trend3Img}
            alt="트렌드 이미지 2"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        ) : shopDataList.length > 0 ? (
          shopDataList.map((shop) => (
            <ShopArtSection key={shop.shopId} shop={shop} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            등록된 추천 아트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

function ShopArtSection({ shop }: { shop: TrendShopGroup }) {
  const navigate = useNavigate();
  const shopLiked = useShopLiked(shop.shopId, shop.isLiked ?? false);

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
                  shopId={shop.shopId}
                  initialLiked={shopLiked}
                  size={15}
                />
              </div>
            </div>

            <p className="-mt-0.5 flex items-center gap-0.5 text-xs text-[#ADB0B5]">
              <AddressPinIcon className="h-3.5 w-3.5 text-[#ADB0B5]" />
              {shop.location}
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
        {shop.arts.map((art, index) => (
          <div key={art.cardId || `art-card-${index}`} className="w-[47%] shrink-0">
            <ArtCard
              cardId={art.cardId}
              instagramUrl={art.instagramUrl}
              shopName={shop.shopName}
              regionName={art.regionName}
              minPrice={art.minPrice}
              maxPrice={art.maxPrice}
              artType={art.artType || 'ART'}
              isLiked={art.isLiked ?? false}
              createdMonth={art.createdMonth}
            />
          </div>
        ))}
      </div>
    </div>
  );
}