interface KakaoAuthResponse {
  access_token: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  refresh_token_expires_in?: number;
}

interface KakaoAuthError {
  error?: string;
  error_description?: string;
  error_code?: string;
}

interface KakaoLoginOptions {
  success: (authResponse: KakaoAuthResponse) => void;
  fail: (error: KakaoAuthError) => void;
  always?: (result: KakaoAuthResponse | KakaoAuthError) => void;
  persistAccessToken?: boolean;
  throughTalk?: boolean;
}

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;

  Auth: {
    login: (options: KakaoLoginOptions) => void;
    logout?: (callback?: () => void) => void;
    getAccessToken?: () => string | null;
    setAccessToken?: (accessToken: string) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export {};
