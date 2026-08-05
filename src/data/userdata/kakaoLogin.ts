const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

export interface KakaoLoginResult {
  email: string | null;
  userName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tempToken: string | null;
  role: string;
  isNewUser: boolean;
}

export interface KakaoLoginResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result?: KakaoLoginResult;
}

interface KakaoLoginRequest {
  accessToken: string;
}

let kakaoInitializePromise: Promise<void> | null = null;

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
        reject(
          new Error('카카오 JavaScript SDK를 불러오지 못했습니다.'),
        );
        return;
      }

      window.setTimeout(checkKakaoSdk, 100);
    };

    checkKakaoSdk();
  });
};

export const initializeKakaoSdk = (): Promise<void> => {
  if (kakaoInitializePromise) {
    return kakaoInitializePromise;
  }

  kakaoInitializePromise = (async () => {
    if (!KAKAO_JS_KEY) {
      throw new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다.');
    }

    const kakao = await waitForKakaoSdk();

    if (!kakao.isInitialized()) {
      kakao.init(KAKAO_JS_KEY);
    }
  })().catch((error) => {
    kakaoInitializePromise = null;
    throw error;
  });

  return kakaoInitializePromise;
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

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/auth/kakao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error('카카오 로그인 서버 요청 실패:', error);

    throw new Error(
      '로그인 서버에 연결하지 못했습니다. 서버 주소와 네트워크 상태를 확인해주세요.',
    );
  }

  let data: KakaoLoginResponse;

  try {
    data = (await response.json()) as KakaoLoginResponse;
  } catch {
    throw new Error(
      `서버 응답을 읽을 수 없습니다. 상태 코드: ${response.status}`,
    );
  }

  if (!response.ok || !data.isSuccess) {
    throw new Error(
      data.message || `카카오 로그인에 실패했습니다. (${response.status})`,
    );
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

export const saveKakaoLoginResult = (
  result: KakaoLoginResult,
): void => {
  localStorage.removeItem('isGuest');

  if (result.email) {
    localStorage.setItem('email', result.email);
  } else {
    localStorage.removeItem('email');
  }

  if (result.userName) {
    localStorage.setItem('nickName', result.userName);
  } else {
    localStorage.removeItem('nickName');
  }

  if (result.refreshToken) {
    localStorage.setItem('refreshToken', result.refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }

  if (result.isNewUser) {
    if (result.tempToken) {
      localStorage.setItem('tempToken', result.tempToken);
    } else {
      localStorage.removeItem('tempToken');
    }

    localStorage.removeItem('accessToken');
    return;
  }

  if (!result.accessToken) {
    throw new Error('로그인 응답에 Access Token이 없습니다.');
  }

  localStorage.setItem('accessToken', result.accessToken);
  localStorage.removeItem('tempToken');
};