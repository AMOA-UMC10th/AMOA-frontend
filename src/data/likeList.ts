// [E102, E104] 찜 목록 조회 API
// 아트 찜과 샵 찜은 서버에서 완전히 별개로 관리된다.
// (아트를 찜해도 그 아트가 속한 샵이 찜되지는 않는다)

export type LikeSortType =
  | 'RECOMMENDED'
  | 'POPULAR'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'LATEST';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== 찜한 아트 =====

export interface LikedCard {
  cardId: number;
  instagramUrl: string;
  artType: string;
  shopName: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  likedAt: string;
}

export interface LikedCardListResult {
  cards: LikedCard[];
  totalCount: number;
  hasNext: boolean;
}

// ===== 찜한 샵 =====

// 샵 카드 하단에 가로 스크롤로 노출되는 대표 아트 썸네일
export interface LikedShopCard {
  cardId: number;
  instagramUrl: string;
  artType: string;
  minPrice: number;
  maxPrice: number;
}

export interface LikedShop {
  shopId: number;
  shopName: string;
  likedAt: string;
  profileImageUrl: string;
  regionName: string;
  cards: LikedShopCard[];
}

export interface LikedShopListResult {
  likedShops: LikedShop[];
  totalElements: number;
  hasNext: boolean;
}

// ===== 공통 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/me`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  if (!token) return {};
  return {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

async function parse<T>(res: Response, label: string): Promise<T> {
  let data: ApiResponse<T> | null = null;
  try {
    data = (await res.json()) as ApiResponse<T>;
  } catch {
    data = null;
  }

  if (!res.ok || !data?.isSuccess) {
    throw new Error(data?.message || `${label} 실패: ${res.status}`);
  }
  return data.result;
}

// ===== API 호출 =====

export async function getLikedCards(params?: {
  sortType?: LikeSortType;
  page?: number;
  size?: number;
}): Promise<LikedCardListResult> {
  const query = new URLSearchParams({
    sortType: params?.sortType ?? 'RECOMMENDED',
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 20),
  });

  const res = await fetch(`${BASE_URL}/liked-cards?${query}`, {
    headers: authHeaders(),
  });
  return parse<LikedCardListResult>(res, '찜한 아트 목록 조회');
}

// 샵은 대표 아트를 중첩해서 내려주느라 응답이 커서 기본 size가 6이다.
export async function getLikedShops(params?: {
  sortType?: LikeSortType;
  page?: number;
  size?: number;
}): Promise<LikedShopListResult> {
  const query = new URLSearchParams({
    sortType: params?.sortType ?? 'RECOMMENDED',
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 6),
  });

  const res = await fetch(`${BASE_URL}/liked-shops?${query}`, {
    headers: authHeaders(),
  });
  return parse<LikedShopListResult>(res, '찜한 샵 목록 조회');
}
