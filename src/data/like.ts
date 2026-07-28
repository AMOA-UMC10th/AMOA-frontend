// ===== 타입 =====

interface LikeApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cards`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function likeCard(cardId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cardId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`아트카드 찜 등록 실패: ${res.status}`);
  }

  const data: LikeApiResponse<unknown> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }
}

export async function unlikeCard(cardId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cardId}/like`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`아트카드 찜 취소 실패: ${res.status}`);
  }

  const data: LikeApiResponse<unknown> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }
}
