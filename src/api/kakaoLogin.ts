const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface NewUserResult {
  memberId: number;
  isNewUser: true;
  onboarding_completed: false;
  tempToken: string;
  kakaoEmail: string | null;
}

export interface ExistingUserResult {
  memberId: number;
  isNewUser: false;
  onboarding_completed: true;
  email: string;
  accessToken: string;
  refreshToken: string;
  nickName: string | null;
}

export type KakaoLoginResult = NewUserResult | ExistingUserResult;

export interface KakaoLoginResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result?: KakaoLoginResult;
}

interface KakaoLoginRequest {
  kakaoAccessToken: string;
}

export async function postKakaoLogin(
  kakaoAccessToken: string,
): Promise<KakaoLoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다.');
  }

  const requestBody: KakaoLoginRequest = {
    kakaoAccessToken,
  };

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/kakao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  let data: KakaoLoginResponse;

  try {
    data = (await response.json()) as KakaoLoginResponse;
  } catch {
    throw new Error('서버 응답을 읽을 수 없습니다.');
  }

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || '카카오 로그인에 실패했습니다.');
  }

  if (!data.result) {
    throw new Error('로그인 응답에 사용자 정보가 없습니다.');
  }

  return data;
}
