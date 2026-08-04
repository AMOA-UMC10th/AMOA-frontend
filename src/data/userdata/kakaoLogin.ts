const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

export interface NewUserResult {
  memberId: number;
  isNewUser: true;
  onboarding_completed: false;
  tempToken: string;
  refreshToken?: string | null;
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
  accessToken: string;
}

const waitForKakaoSdk = (): Promise<NonNullable<Window['Kakao']>> => {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const timeout = 5000;

    const checkKakaoSdk = () => {
      if (window.Kakao) {
        resolve(window.Kakao);
        return;
      }

      if (Date.now() - startedAt >= timeout) {
        reject(new Error('카카오 JavaScript SDK를 불러오지 못했습니다.'));
        return;
      }

      window.setTimeout(checkKakaoSdk, 100);
    };

    checkKakaoSdk();
  });
};

export const initializeKakaoSdk = async (): Promise<void> => {
  if (!KAKAO_JS_KEY) {
    throw new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다.');
  }

  const kakao = await waitForKakaoSdk();

  if (!kakao.isInitialized()) {
    kakao.init(KAKAO_JS_KEY);
  }
};

export async function postKakaoLogin(
  kakaoAccessToken: string,
): Promise<KakaoLoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다.');
  }

  const requestBody: KakaoLoginRequest = {
    accessToken: kakaoAccessToken,
  };

  const response = await fetch(`${API_BASE_URL}/auth/kakao`, {
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

export const startKakaoLogin = async (): Promise<KakaoLoginResult> => {
  await initializeKakaoSdk();

  if (!window.Kakao?.Auth) {
    throw new Error('카카오 로그인 기능을 사용할 수 없습니다.');
  }

  return new Promise<KakaoLoginResult>((resolve, reject) => {
    window.Kakao?.Auth.login({
      throughTalk: true,

      success: async (authResponse) => {
        try {
          const kakaoAccessToken = authResponse.access_token;

          if (!kakaoAccessToken) {
            throw new Error('카카오 Access Token을 받지 못했습니다.');
          }

          const response = await postKakaoLogin(kakaoAccessToken);
          const result = response.result;

          if (!result) {
            throw new Error('로그인 결과가 없습니다.');
          }

          resolve(result);
        } catch (error) {
          reject(
            error instanceof Error
              ? error
              : new Error('카카오 로그인 중 오류가 발생했습니다.'),
          );
        }
      },

      fail: (error) => {
        reject(
          new Error(
            error.error_description ||
              '카카오 로그인이 취소되었거나 실패했습니다.',
          ),
        );
      },
    });
  });
};

export const saveKakaoLoginResult = (result: KakaoLoginResult): void => {
  localStorage.setItem('memberId', String(result.memberId));
  localStorage.removeItem('isGuest');

  if (result.isNewUser) {
    localStorage.setItem('tempToken', result.tempToken);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('nickName');

    if (result.kakaoEmail) {
      localStorage.setItem('kakaoEmail', result.kakaoEmail);
    } else {
      localStorage.removeItem('kakaoEmail');
    }

    if (result.refreshToken) {
      localStorage.setItem('refreshToken', result.refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }

    return;
  }

  localStorage.setItem('accessToken', result.accessToken);
  localStorage.setItem('refreshToken', result.refreshToken);
  localStorage.setItem('email', result.email);

  if (result.nickName) {
    localStorage.setItem('nickName', result.nickName);
  } else {
    localStorage.removeItem('nickName');
  }

  localStorage.removeItem('tempToken');
  localStorage.removeItem('kakaoEmail');
};
