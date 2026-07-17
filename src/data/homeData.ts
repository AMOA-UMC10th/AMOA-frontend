// G101 홈 화면 목업 데이터 (추후 실제 API 응답으로 교체)
// 카드 관련 타입/목업은 nailData.ts의 NailCard로 통합되었습니다.

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

export const MOCK_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
    imageUrl: '',
  },
];