import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';

import { fetchHomeCards, type RecommendedCard, type TrendSlide } from '../data/home';
import { getMyProfile } from '../data/userdata/user'; 

const DEFAULT_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [monthlyArt, setMonthlyArt] = useState<RecommendedCard[]>([]);
  const [yearEndPick, setYearEndPick] = useState<RecommendedCard[]>([]);
  const [nickname, setNickname] = useState<string | null>(null);
  const [trendSlides, setTrendSlides] = useState<TrendSlide[]>(DEFAULT_TREND_SLIDES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const userProfile = await getMyProfile();
            if (userProfile?.nickname) {
              setNickname(userProfile.nickname);
            }
          } catch (err) {
            console.error('내 정보 조회 실패:', err);
          }
        }

        const data = await fetchHomeCards();
        if (data.nickname) {
          setNickname(data.nickname);
        }
        setMonthlyArt(data.monthlyArt?.cards || []);
        setYearEndPick(data.yearEndPick?.cards || []);

      } catch (error) {
        console.error('홈 데이터 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
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

      <TrendBanner slides={trendSlides} />

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
          <RecommendArtList items={monthlyArt.slice(0, 2)} />

          <PickSection
            title="완벽한 연말을 위한 PICK"
            highlightWord="PICK"
            items={yearEndPick}
            onMoreClick={handlePickMoreClick}
          />
        </>
      )}
    </div>
  );
}