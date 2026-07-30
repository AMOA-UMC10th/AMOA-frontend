// 디자인 무드(태그) 목록 조회 API
// 온보딩 선호 디자인(A102)과 마이페이지 재설정(F104)이 같은 목록을 쓴다.
// 저장에는 서버가 내려주는 designtagId를 그대로 써야 해서 하드코딩하지 않고 받아온다.

export interface DesignMood {
  designtagId: number;
  name: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/design-moods`;

export async function getDesignMoods(): Promise<DesignMood[]> {
  const token = localStorage.getItem("tempToken");

  const res = await fetch(BASE_URL, {
    headers: token
      ? {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    throw new Error(`디자인 무드 목록 조회 실패: ${res.status}`);
  }

  const data: ApiResponse<{ designtags: DesignMood[] }> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.designtags;
}
