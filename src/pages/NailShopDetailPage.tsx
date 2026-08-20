import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShopInfo from '../components/nail_shop_detail/ShopInfo';
import ShopArtList from '../components/nail_shop_detail/ShopArtList';
import {
  fetchShopDetail,
  fetchShopCards,
  type ShopDetail,
  type ShopCardListResult,
} from '../data/shop';
import Spinner from '../components/common/Spinner';

export default function NailShopDetailPage() {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const id = Number(shopId) || 1;

  const [shopInfo, setShopInfo] = useState<ShopDetail | null>(null);
  const [cardData, setCardData] = useState<ShopCardListResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [shopLikeCount, setShopLikeCount] = useState(0);
  const [cardLikeCount, setCardLikeCount] = useState(0);

  const bumpCount =
    (setCount: React.Dispatch<React.SetStateAction<number>>) => (liked: boolean) =>
      setCount((count) => Math.max(0, liked ? count + 1 : count - 1));

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [shopRes, cardsRes] = await Promise.all([
          fetchShopDetail(id),
          fetchShopCards(id),
        ]);
        setShopInfo(shopRes);
        setCardData(cardsRes);
        setShopLikeCount(shopRes.shopLikeCount);
        setCardLikeCount(shopRes.cardLikeCount);
      } catch (err) {
        console.error('샵 상세 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading || !shopInfo || !cardData) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-lg flex flex-col font-sans">
      <header className="w-full h-12 px-4 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28323C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="w-6" />
      </header>

      <main className="flex-1 overflow-y-auto">
        <ShopInfo
          shop={shopInfo}
          shopLikeCount={shopLikeCount}
          cardLikeCount={cardLikeCount}
          onShopLikeChange={bumpCount(setShopLikeCount)}
        />

        <ShopArtList
          cards={cardData.cards}
          shopName={cardData.shopName}
          onCardLikeChange={bumpCount(setCardLikeCount)}
        />
      </main>
    </div>
  );
}