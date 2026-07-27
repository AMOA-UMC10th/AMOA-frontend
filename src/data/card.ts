// ===== 타입 =====

export interface DesignTagInfo {
  designTagId: number;
  name: string;
}

export interface CardDetail {
  cardId: number;
  shopId: number;
  shopName: string;
  instagramUrl: string;
  artType: string;
  designTags: DesignTagInfo[];
  minPrice: number;
  maxPrice: number;
  address: string;
  createdMonth: string;
}

export interface RecommendedCard {
  cardId: number;
  shopName: string;
  instagramUrl: string;
  artType: string;
  minPrice: number;
  maxPrice: number;
  regionName: string;
  createdMonth: string;
  isLiked: boolean;
}

interface CardApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== API 호출 =====

// TODO: 백엔드가 카드 관련 API를 /api/v1로 통일하면(리팩토링 예정, 날짜 미정)
// ORIGIN 우회 없이 VITE_API_BASE_URL을 그대로 써서 다른 파일들과 통일할 것
const ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1$/, "");
const BASE_URL = `${ORIGIN}/api/cards`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchCardDetail(cardId: number): Promise<CardDetail> {
  const res = await fetch(`${BASE_URL}/${cardId}`, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`아트 상세 조회 실패: ${res.status}`);
  }

  const data: CardApiResponse<{ card: CardDetail }> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.card;
}

export async function fetchRecommendedCards(cardId: number): Promise<RecommendedCard[]> {
  const res = await fetch(`${BASE_URL}/${cardId}/recommendations`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`연관 추천 아트 조회 실패: ${res.status}`);
  }

  const data: CardApiResponse<{ cards: RecommendedCard[] }> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.cards;
}
