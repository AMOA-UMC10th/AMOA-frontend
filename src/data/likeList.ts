// [E102, E104] 찜 목록 조회 API
// 아트와 샵은 응답 모양이 서로 달라서 목록도 따로 받아온다.

import { authFetch } from "../api/authFetch";

export type LikeSortType =
  | 'RECOMMENDED'
  | 'POPULAR'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'LATEST';

export interface LikedCard {
  cardId: number;
  instagramUrl: string;
  artType: string;
  shopName: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  likedAt: string;
  createdMonth: string;
}

export interface LikedShopCard {
  cardId: number;
  instagramUrl: string;
  artType: string;
  minPrice: number;
  maxPrice: number;
  createdMonth: string;
}

export interface LikedShop {
  shopId: number;
  shopName: string;
  likedAt: string;
  profileImageUrl: string;
  regionName: string;
  cards: LikedShopCard[];
}

export interface LikedCardsResult {
  cards: LikedCard[];
  totalCount: number;
  hasNext: boolean;
}

export interface LikedShopsResult {
  likedShops: LikedShop[];
  totalElements: number;
  hasNext: boolean;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/me`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return token
    ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` }
    : {};
}

async function get<T>(path: string, label: string): Promise<T> {
  const res = await authFetch(`${BASE_URL}${path}`, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`${label} 실패: ${res.status}`);
  }

  const data: ApiResponse<T> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

export async function getLikedCards(
  sortType: LikeSortType = 'RECOMMENDED',
  page = 0,
  size = 20,
): Promise<LikedCardsResult> {
  return get<LikedCardsResult>(
    `/liked-cards?sortType=${sortType}&page=${page}&size=${size}`,
    '찜한 아트 목록 조회',
  );
}

export async function getLikedShops(
  sortType: LikeSortType = 'RECOMMENDED',
  page = 0,
  size = 6,
): Promise<LikedShopsResult> {
  return get<LikedShopsResult>(
    `/liked-shops?sortType=${sortType}&page=${page}&size=${size}`,
    '찜한 샵 목록 조회',
  );
}
