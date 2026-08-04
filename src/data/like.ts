// ===== 타입 =====

import { authFetch } from "../api/authFetch";

interface LikeApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class LikeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cards`;

// 나머지 찜 요청과 같이 authFetch를 쓴다.
// 생 fetch로 보내면 액세스 토큰이 만료됐을 때 재발급 없이 401로 끝나서,
// 화면 하트만 켜지고 서버에는 저장되지 않는다. (새로고침하면 찜이 풀림)
export async function likeCard(cardId: number): Promise<void> {
  const res = await authFetch(`${BASE_URL}/${cardId}/like`, {
    method: "POST",
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `아트카드 찜 등록 실패: ${res.status}`, res.status);
  }
}

export async function unlikeCard(cardId: number): Promise<void> {
  const res = await authFetch(`${BASE_URL}/${cardId}/like`, {
    method: "DELETE",
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `아트카드 찜 취소 실패: ${res.status}`, res.status);
  }
}

// 샵 찜은 아트카드와 별개다. (POST/DELETE /shops/{shopId}/like)
const SHOP_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/shops`;

export async function likeShop(shopId: number): Promise<void> {
  const res = await authFetch(`${SHOP_BASE_URL}/${shopId}/like`, {
    method: "POST",
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `샵 찜 등록 실패: ${res.status}`, res.status);
  }
}

export async function unlikeShop(shopId: number): Promise<void> {
  const res = await authFetch(`${SHOP_BASE_URL}/${shopId}/like`, {
    method: "DELETE",
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `샵 찜 취소 실패: ${res.status}`, res.status);
  }
}
