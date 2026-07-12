//G101 메인 홈 화면 (추천)

import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/home/HomeHeader';
import RecommendBanner from '../components/home/RecommendBanner';
import RecommendArtList from '../components/home/RecommendArtList';
import type { RecommendArt } from '../components/home/RecommendArtList';
import TrendBanner from '../components/home/TrendBanner';
import type { TrendSlide } from '../components/home/TrendBanner';
import PickSection from '../components/home/PickSection';

// TODO: 실제로는 로그인/온보딩 결과 API에서 받아와야 함
const MOCK_USER = {
  nickname: '길동',
  region: '용산구 청파동',
  mood: '화려한 무드',
};

const MOCK_ARTS: RecommendArt[] = [
  {
    id: '1',
    shopId: 'shop1',
    shopUsername: 'youwho_nail_hong...',
    shopProfileImage: '',
    shopName: '미니숍네일',
    location: '성동동',
    priceRange: '40,000~70,000원',
    imageUrls: [''],
  },
  {
    id: '2',
    shopId: 'shop2',
    shopUsername: 'minishop_nail_',
    shopProfileImage: '',
    shopName: '미니숍네일',
    location: '성동동',
    priceRange: '40,000~70,000원',
    imageUrls: ['', ''],
  },
];

const MOCK_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
    imageUrl: '',
  },
];

const MOCK_PICK_ARTS: RecommendArt[] = [
  {
    id: '3',
    shopId: 'shop3',
    shopUsername: 'pick_nail_shop',
    shopProfileImage: '',
    shopName: '연말 스페셜 네일',
    location: '강남구',
    priceRange: '50,000~80,000원',
    imageUrls: [''],
  },
];

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
    <div className="max-w-sm mx-auto">
      <HomeHeader />
      <RecommendBanner
        nickname={nickname}
        matchLabel={matchLabel}
        onMoreClick={handleMoreClick}
      />
      <RecommendArtList items={MOCK_ARTS} />

      <TrendBanner slides={MOCK_TREND_SLIDES} />

      <PickSection
        title="완벽한 연말을 위한 PICK"
        items={MOCK_PICK_ARTS}
        onMoreClick={handlePickMoreClick}
      />
    </div>
  );
}
