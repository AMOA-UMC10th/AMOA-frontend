// ===== 타입 =====

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
const SHOP_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/shops`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function likeCard(cardId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cardId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `아트카드 찜 등록 실패: ${res.status}`, res.status);
  }
}

export async function unlikeCard(cardId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cardId}/like`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data: LikeApiResponse<unknown> = await res.json();

  if (!res.ok || !data.isSuccess) {
    throw new LikeApiError(data.message ?? `아트카드 찜 취소 실패: ${res.status}`, res.status);
  }
}

// 샵 찜은 아트 찜과 별개다. 아트를 찜해도 그 아트가 속한 샵은 찜되지 않는다.
export async function likeShop(shopId: number): Promise<void> {
  const res = await fetch(`${SHOP_BASE_URL}/${shopId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`샵 찜 등록 실패: ${res.status}`);
  }

  const data: LikeApiResponse<unknown> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }
}

export async function unlikeShop(shopId: number): Promise<void> {
  const res = await fetch(`${SHOP_BASE_URL}/${shopId}/like`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`샵 찜 취소 실패: ${res.status}`);
  }

  const data: LikeApiResponse<unknown> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }
}
