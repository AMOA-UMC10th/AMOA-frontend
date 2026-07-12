// G101 홈 화면 목업 데이터 (추후 실제 API 응답으로 교체)

export interface RecommendArt {
  id: string;
  shopId: string;
  shopUsername: string;
  shopProfileImage: string;
  shopName: string;
  location: string;
  priceRange: string;
  imageUrls: string[];
}

export interface TrendSlide {
  id: string;
  title: string;
  imageUrl: string;
}

export interface HomeUser {
  nickname: string;
  region: string;
  mood: string;
}

// TODO: 실제로는 로그인/온보딩 결과 API에서 받아와야 함
export const MOCK_USER: HomeUser = {
  nickname: '길동',
  region: '용산구 청파동',
  mood: '화려한 무드',
};

// TODO: GET /api/cards 에 관심지역/디자인무드 필터 쿼리 파라미터를 붙여서 호출 예상
export const MOCK_ARTS: RecommendArt[] = [
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

export const MOCK_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
    imageUrl: '',
  },
];

export const MOCK_PICK_ARTS: RecommendArt[] = [
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
