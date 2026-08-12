// ===== 타입 =====

import { authFetch } from "../api/authFetch";

export interface WithdrawApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/me`;

export async function withdrawUser(): Promise<void> {
  const token = localStorage.getItem("accessToken");

  const res = await authFetch(BASE_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`회원 탈퇴 요청 실패: ${res.status}`);
  }

  const data: WithdrawApiResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }
}
