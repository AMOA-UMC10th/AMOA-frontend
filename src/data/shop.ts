import { authFetch } from '../api/authFetch';
import { fetchCardDetail } from './card';

// ===== 기존 샵 상세 타입 =====
export interface DesignTag {
  designtagId: number;
  name: string;
}

export interface ShopDetail {
  shopId: number;
  shopName: string;
  address: string;
  shopPhoneNumber: string;
  businessHours: string;
  designtags: DesignTag[];
  cardLikeCount: number;
  shopLikeCount: number;
  isLiked: boolean;
}

export interface ShopCardItem {
  cardId: number;
  regionName: string;
  minPrice: number;
  maxPrice: number;
  artType: string;
  isLiked: boolean;
  createdMonth: string;
  instagramUrl?: string; // ArtCard 바인딩용 (응답에 없는 경우 기본값 처리)
}

export interface ShopCardListResult {
  shopId: number;
  shopName: string;
  totalCount: number;
  cards: ShopCardItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ShopApiResponse<T> {
  code: string;
  message: string;
  isSuccess: boolean;
  result: T;
}

// ===== API 호출 함수 =====
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/shops`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function fetchShopDetail(shopId: number): Promise<ShopDetail> {
  const res = await authFetch(`${BASE_URL}/${shopId}`, {
  });

  if (!res.ok) throw new Error(`샵 상세 조회 실패: ${res.status}`);
  const data: ShopApiResponse<ShopDetail> = await res.json();
  if (!data.isSuccess) throw new Error(data.message);

  return data.result;
}

export async function fetchShopCards(
  shopId: number,
  params?: { artType?: string; sort?: string; cursor?: string; size?: number }
): Promise<ShopCardListResult> {
  const query = new URLSearchParams();
  if (params?.artType && params.artType !== '전체') query.append('artType', params.artType);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.cursor) query.append('cursor', params.cursor);
  if (params?.size) query.append('size', String(params.size));

  const res = await authFetch(`${BASE_URL}/${shopId}/cards?${query.toString()}`, {
  });

  if (!res.ok) throw new Error(`샵 카드 목록 조회 실패: ${res.status}`);
  const data: ShopApiResponse<ShopCardListResult> = await res.json();
  if (!data.isSuccess) throw new Error(data.message);

  const cardsWithFullDetail = await Promise.all(
    data.result.cards.map(async (card) => {
      try {
        const detail = await fetchCardDetail(card.cardId);
        return {
          ...card,
          // CardDetail 전체 정보를 가져와 병합
          instagramUrl: detail.instagramUrl,
          minPrice: detail.minPrice ?? card.minPrice,
          maxPrice: detail.maxPrice ?? card.maxPrice,
          artType: detail.artType || card.artType,
          designTags: detail.designTags,
          address: detail.address,
        };
      } catch (err) {
        return card; // 상세 불러오기 실패 시 기본 카드 정보 유지
      }
    })
  );

  return {
    ...data.result,
    cards: cardsWithFullDetail,
  };
}