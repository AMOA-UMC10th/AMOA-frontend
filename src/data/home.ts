import { authFetch } from '../api/authFetch';
import type { RecommendedCard } from './card';
export type { RecommendedCard };

// ===== 트렌드 배너 & 유저 정보 타입 =====

export interface TrendSlide {
  id: string;
  title: string;
  imageUrl?: string;
  trendBannerImg?: string;
}

export interface HomeUser {
  nickname: string;
  region: string;
  mood: string;
}

export const MOCK_TREND_SLIDES: TrendSlide[] = [
  {
    id: '1',
    title: '조금은 색다른 분위기를 원해?\n레이스 네일 모음 Zip.',
    trendBannerImg: '',
  },
];

export interface HomeCardsResult {
  nickname: string | null;
  monthlyArt: { cards: RecommendedCard[] };
  yearEndPick: { cards: RecommendedCard[] };
}

interface CardApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cards/home`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchHomeCards(): Promise<HomeCardsResult> {
  const res = await authFetch(`${BASE_URL}`);

  if (!res.ok) {
    throw new Error(`카드 목록 조회 실패: ${res.status}`);
  }

  const data: CardApiResponse<any> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  const result = data.result;

  const monthlyCards: RecommendedCard[] = result?.monthlyArt?.cards || [];
  const yearEndCards: RecommendedCard[] =
    result?.yearEndPick?.cards || result?.pick?.cards || [];

  return {
    nickname: result?.nickname || null,
    monthlyArt: { cards: monthlyCards },
    yearEndPick: { cards: yearEndCards },
  };
}