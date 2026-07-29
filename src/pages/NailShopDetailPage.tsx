import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShopInfo from '../components/nail_shop_detail/ShopInfo';
import ShopArtList, { type SortOption } from '../components/nail_shop_detail/ShopArtList';
import {
  fetchShopDetail,
  fetchShopCards,
  type ShopDetail,
  type ShopCardListResult,
} from '../data/shop';

export default function NailShopDetailPage() {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const id = Number(shopId) || 1;

  const [shopInfo, setShopInfo] = useState<ShopDetail | null>(null);
  const [cardData, setCardData] = useState<ShopCardListResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [selectedSort, setSelectedSort] = useState<SortOption>('LATEST');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [shopRes, cardsRes] = await Promise.all([
          fetchShopDetail(id),
          fetchShopCards(id), // sort 파라미터를 안 넘겨서 500 에러 방지
        ]);
        setShopInfo(shopRes);
        setCardData(cardsRes);
      } catch (err) {
        console.error('샵 상세 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const sortedAndFilteredCards = useMemo(() => {
    if (!cardData?.cards) return [];

    let list = [...cardData.cards];

    // 1. 아트 타입 필터링
    if (selectedFilter !== '전체') {
      list = list.filter((card) => card.artType === selectedFilter);
    }

    // 2. 가격 정렬 처리
    if (selectedSort === 'PRICE_HIGH') {
      list.sort((a, b) => (b.maxPrice || b.minPrice) - (a.maxPrice || a.minPrice));
    } else if (selectedSort === 'PRICE_LOW') {
      list.sort((a, b) => (a.minPrice || a.maxPrice) - (b.minPrice || b.maxPrice));
    }

    return list;
  }, [cardData, selectedFilter, selectedSort]);

  if (loading || !shopInfo || !cardData) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-white flex items-center justify-center text-sm text-gray-400">
        로딩 중...
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
        <ShopInfo shop={shopInfo} />

        <ShopArtList
          cards={sortedAndFilteredCards} // ★ 정렬/필터링된 리스트 전달
          totalCount={sortedAndFilteredCards.length}
          shopName={cardData.shopName}
          onFilterChange={(artType) => setSelectedFilter(artType)}
          onSortChange={(sort) => setSelectedSort(sort)}
        />
      </main>
    </div>
  );
}