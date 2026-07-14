//G101 메인 홈 화면 (추천)

import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';
import ShopOwnerBanner from '../components/home/ShopOwnerBanner';
import {
  MOCK_USER,
  MOCK_ARTS,
  MOCK_TREND_SLIDES,
  MOCK_PICK_ARTS,
} from '../data/homeData';

export default function HomePage() {
  const navigate = useNavigate();
  const { nickname, region, mood } = MOCK_USER;

  const matchLabel = [mood, region].filter(Boolean).join(' · ');

  const handleMoreClick = () => {
    // TODO: 현재 관심지역+무드를 필터로 아트찾기 화면에 전달
    navigate('/art-search', { state: { region, mood } });
  };

  const handlePickMoreClick = () => {
    // TODO: PICK 섹션 전체보기 화면으로 이동
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
      <RecommendArtList items={MOCK_ARTS} />

      <PickSection
        title="완벽한 연말을 위한 PICK"
        items={MOCK_PICK_ARTS}
        onMoreClick={handlePickMoreClick}
      />

      <ShopOwnerBanner />
    </div>
  );
}
