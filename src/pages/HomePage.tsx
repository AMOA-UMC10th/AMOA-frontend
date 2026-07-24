import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';
import ShopOwnerBanner from '../components/home/ShopOwnerBanner';
import { mockCardResponse } from '../data/mockupdata/nailData'; 
import { MOCK_TREND_SLIDES } from '../data/mockupdata/homeData';
import { mockSettingData } from '../data/mockupdata/userData';

export default function HomePage() {
  const navigate = useNavigate();

  const userSetting = mockSettingData.result;
  const nickname = userSetting.nickname;
  
  const region = userSetting.interestedRegions[0] || '';
  const mood = userSetting.preferredMoods[0] || '';

  const matchLabel = [mood, region].filter(Boolean).join(' · ');

  const handleMoreClick = () => {
    navigate('/art-search', { state: { region, mood } });
  };

  const handlePickMoreClick = () => {
    navigate('/art-search');
  };

  const cardsList = mockCardResponse.result.cards;

  return (
    <div className="w-full pb-[64px]">
      <HomeHeader />

      <TrendBanner slides={MOCK_TREND_SLIDES} />

      <RecommendBanner
        nickname={nickname}
        matchLabel={matchLabel}
        onMoreClick={handleMoreClick}
      />
      
      <RecommendArtList items={cardsList} />

      <PickSection
        title="완벽한 연말을 위한 PICK"
        highlightWord="PICK"
        items={cardsList.slice(0, 4)}
        onMoreClick={handlePickMoreClick}
      />

      <ShopOwnerBanner />
    </div>
  );
}