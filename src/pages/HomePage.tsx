import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';
import ArtCard from '../components/common/ArtCard';

import {
  fetchHomeCards,
  type RecommendedCard,
  type TrendSlide,
} from '../data/home';
import { getMyProfile } from '../data/userdata/user';
import { useRequireLogin } from '../hooks/useRequireLogin';

const DEFAULT_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { requireLogin } = useRequireLogin();

  const [monthlyArt, setMonthlyArt] = useState<RecommendedCard[]>([]);
  const [yearEndPick, setYearEndPick] = useState<RecommendedCard[]>([]);
  const [nickname, setNickname] = useState<string | null>(null);
  const [trendSlides, setTrendSlides] =
    useState<TrendSlide[]>(DEFAULT_TREND_SLIDES);
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
            console.error(err);
          }
        }

        const data = await fetchHomeCards();

        if (data.nickname) {
          setNickname(data.nickname);
        }

        setMonthlyArt(data.monthlyArt?.cards || []);
        setYearEndPick(data.yearEndPick?.cards || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleMoreClick = () => {
    if (!requireLogin()) {
      return;
    }

    navigate('/art-search');
  };

  const handlePickMoreClick = () => {
    if (!requireLogin()) {
      return;
    }

    navigate('/art-search');
  };

  return (
    <div className="w-full pb-[64px]">
      <HomeHeader />

      <TrendBanner slides={trendSlides} />

      <RecommendBanner nickname={nickname} onMoreClick={handleMoreClick} />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-0.5 gap-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ArtCard key={`home-skeleton-${index}`} isLoading={true} />
          ))}
        </div>
      ) : (
        <>
          <RecommendArtList items={monthlyArt.slice(0, 6)} />

          <PickSection
            title="올여름 절대 놓칠 수 없는 PICK"
            highlightWord="PICK"
            items={yearEndPick}
            onMoreClick={handlePickMoreClick}
          />
        </>
      )}
    </div>
  );
}