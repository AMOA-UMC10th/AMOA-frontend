import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';
import ShopOwnerBanner from '../components/home/ShopOwnerBanner';

import { MOCK_TREND_SLIDES } from '../data/mockupdata/homeData';
import { fetchHomeCards, type RecommendedCard } from '../data/card';

export default function HomePage() {
  const navigate = useNavigate();

  const [monthlyArt, setMonthlyArt] = useState<RecommendedCard[]>([]);
  const [yearEndPick, setYearEndPick] = useState<RecommendedCard[]>([]);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeCards() {
      try {
        setIsLoading(true);
        const data = await fetchHomeCards();
        setNickname(data.nickname);
        setMonthlyArt(data.monthlyArt.cards);
        setYearEndPick(data.yearEndPick.cards);
      } catch (error) {
        console.error('홈 카드 목록 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeCards();
  }, []);

  const handleMoreClick = () => {
    navigate('/art-search');
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
        onMoreClick={handleMoreClick}
      />
      
      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-400">
          아트를 불러오는 중입니다...
        </div>
      ) : (
        <>
          <RecommendArtList items={monthlyArt} />

          <PickSection
            title="완벽한 연말을 위한 PICK"
            highlightWord="PICK"
            items={yearEndPick}
            onMoreClick={handlePickMoreClick}
          />
        </>
      )}

      <ShopOwnerBanner />
    </div>
  );
}