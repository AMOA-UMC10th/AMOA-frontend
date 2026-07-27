//네일샵 상세 페이지 (D101)

import { useNavigate } from 'react-router-dom';
import { mockCardListData, mockShopDetailData } from '../data/mockupdata/shopData';
import ShopInfo from '../components/nail_shop_detail/ShopInfo';
import ShopArtList from '../components/nail_shop_detail/ShopArtList';

export default function NailShopDetailPage() {
  const navigate = useNavigate();

  // 대입할 임시 목데이터 구조 분해
  const shopInfo = mockShopDetailData.result;
  const cardData = mockCardListData.result;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-lg flex flex-col font-sans">
      {/* 상단 앱바 상단 영역 */}
      <header className="w-full h-12 px-4 flex items-center justify-between bg-white border-b border-gray-50 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28323C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="w-6" /> {/* 정렬 레이아웃을 위한 빈 공간 */}
      </header>

      {/* 스크롤 메인 바디 영역 */}
      <main className="flex-1 overflow-y-auto">
        {/* 1. 샵 상세 상단 정보 컴포넌트 */}
        <ShopInfo shop={shopInfo} />

        {/* 2. 샵 하단 소속 아트 목록 컴포넌트 */}
        <ShopArtList cards={cardData.cards} totalCount={cardData.total_count} />
      </main>
    </div>
  );
}