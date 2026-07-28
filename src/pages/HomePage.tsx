import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';
import ShopOwnerBanner from '../components/home/ShopOwnerBanner';

import { MOCK_TREND_SLIDES } from '../data/mockupdata/homeData';
import { mockSettingData } from '../data/mockupdata/userData';
import { fetchCards, type RecommendedCard } from '../data/card';

export default function HomePage() {
  const navigate = useNavigate();

  const [cardsList, setCardsList] = useState<RecommendedCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userSetting = mockSettingData.result;
  const nickname = userSetting.nickname;
  
  const region = userSetting.interestedRegions[0] || '';
  const mood = userSetting.preferredMoods[0] || '';

  const matchLabel = [mood, region].filter(Boolean).join(' · ');

  useEffect(() => {
    async function loadHomeCards() {
      try {
        setIsLoading(true);
        // 메인 페이지에 노출할 카드 데이터 조회 (최대 10개)
        const data = await fetchCards({ size: 10 });
        setCardsList(data.cards);
      } catch (error) {
        console.error('홈 카드 목록 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeCards();
  }, []);

  const handleMoreClick = () => {
    navigate('/art-search', { state: { region, mood } });
  };

  const handlePickMoreClick = () => {
    navigate('/art-search');
  };

  return (
    <div className="w-full pb-[64px]">
      <HomeHeader />

      <TrendBanner slides={MOCK_TREND_SLIDES} />

      <RecommendBanner
        nickname={nickname}
        matchLabel={matchLabel}
        onMoreClick={handleMoreClick}
      />
      
      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-400">
          아트를 불러오는 중입니다...
        </div>
      ) : (
        <>
          <RecommendArtList items={cardsList} />

          <PickSection
            title="완벽한 연말을 위한 PICK"
            highlightWord="PICK"
            items={cardsList.slice(0, 4)}
            onMoreClick={handlePickMoreClick}
          />
        </>
      )}

      <ShopOwnerBanner />
    </div>
  );
}