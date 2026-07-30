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

// ===== 아트 검색 API =====

export interface CardSearchParams {
  regionIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  artType?: string; // 'ALL'이면 보내지 않음
  designTagIds?: number[];
  sort?: string;
  cursor?: string;
  size?: number;
}

export interface CardSearchResult {
  totalCount: number;
  size: number;
  cards: RecommendedCard[];
  nextCursor: string | null;
  hasNext: boolean;
}

// ===== 홈 화면 카드 API =====

export interface HomeCardsResult {
  nickname: string | null;
  monthlyArt: { cards: RecommendedCard[] };
  yearEndPick: { cards: RecommendedCard[] };
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cards`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchHomeCards(): Promise<HomeCardsResult> {
  const res = await fetch(`${BASE_URL}/home`, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`홈 화면 카드 조회 실패: ${res.status}`);
  }

  const data: CardApiResponse<HomeCardsResult> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

export async function fetchCards(params: CardSearchParams): Promise<CardSearchResult> {
  const query = new URLSearchParams();

  params.regionIds?.forEach((id) => query.append('regionIds', String(id)));
  params.designTagIds?.forEach((id) => query.append('designTagIds', String(id)));

  if (params.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
  if (params.artType) query.append('artType', params.artType);
  if (params.sort) query.append('sort', params.sort);
  if (params.cursor) query.append('cursor', params.cursor);
  if (params.size !== undefined) query.append('size', String(params.size));

  const res = await fetch(`${BASE_URL}?${query.toString()}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`아트 목록 조회 실패: ${res.status}`);
  }

  const data: CardApiResponse<CardSearchResult> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
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