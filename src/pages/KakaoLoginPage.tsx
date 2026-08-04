import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  postKakaoLogin,
  type ExistingUserResult,
  type NewUserResult,
} from '../data/userdata/kakaoLogin';

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

function KakaoLoginPage() {
  const navigate = useNavigate();

  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!KAKAO_JS_KEY) {
      console.error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다.');
      setErrorMessage('카카오 로그인 설정을 확인해주세요.');
      return;
    }

    const initializeKakao = () => {
      if (!window.Kakao) {
        console.error('카카오 JavaScript SDK가 로드되지 않았습니다.');
        setErrorMessage('카카오 로그인 기능을 불러오지 못했습니다.');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }

      setIsKakaoReady(true);
      setErrorMessage(null);
    };

    if (window.Kakao) {
      initializeKakao();
      return;
    }

    const intervalId = window.setInterval(() => {
      if (window.Kakao) {
        window.clearInterval(intervalId);
        initializeKakao();
      }
    }, 100);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);

      if (!window.Kakao) {
        setErrorMessage('카카오 로그인 기능을 불러오지 못했습니다.');
      }
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleNewUser = (result: NewUserResult): void => {
    localStorage.setItem('tempToken', result.tempToken);
    localStorage.setItem('memberId', String(result.memberId));

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

    localStorage.removeItem('accessToken');

    // 카카오 로그인을 시작했으므로 게스트 상태 해제
    localStorage.removeItem('isGuest');

    navigate('/onboarding/design', {
      replace: true,
    });
  };

  const handleExistingUser = (result: ExistingUserResult): void => {
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    localStorage.setItem('memberId', String(result.memberId));
    localStorage.setItem('email', result.email);

    if (result.nickName) {
      localStorage.setItem('nickName', result.nickName);
    } else {
      localStorage.removeItem('nickName');
    }

    localStorage.removeItem('tempToken');
    localStorage.removeItem('kakaoEmail');

    // 기존 회원으로 로그인했으므로 게스트 상태 해제
    localStorage.removeItem('isGuest');

    navigate('/home', {
      replace: true,
    });
  };

  const handleGuestMode = (): void => {
    /*
     * 이전 로그인 정보가 남아 있으면 게스트로 정확히 인식되지 않을 수 있으므로
     * 서비스 로그인 관련 정보만 삭제합니다.
     */
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickName');
    localStorage.removeItem('kakaoEmail');

    // 게스트 상태 저장
    localStorage.setItem('isGuest', 'true');

    navigate('/home', {
      replace: true,
    });
  };

  const handleKakaoLogin = (): void => {
    if (isLoading) {
      return;
    }

    setErrorMessage(null);

    if (!window.Kakao?.Auth) {
      setErrorMessage('카카오 로그인이 아직 준비되지 않았습니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      if (!KAKAO_JS_KEY) {
        setErrorMessage('카카오 로그인 키가 없습니다.');
        return;
      }

      window.Kakao.init(KAKAO_JS_KEY);
    }

    setIsLoading(true);

    window.Kakao.Auth.login({
      throughTalk: true,
      success: async (authResponse) => {
        try {
          const kakaoAccessToken = authResponse.access_token;

          if (!kakaoAccessToken) {
            throw new Error('카카오 Access Token을 받지 못했습니다.');
          }

          const data = await postKakaoLogin(kakaoAccessToken);
          const result = data.result;

          if (!result) {
            throw new Error('로그인 결과가 없습니다.');
          }

          if (result.isNewUser || !result.onboarding_completed) {
            if (!('tempToken' in result)) {
              throw new Error('온보딩용 임시 토큰이 없습니다.');
            }

            handleNewUser(result as NewUserResult);
            return;
          }

          if (!('accessToken' in result) || !('refreshToken' in result)) {
            throw new Error('서비스 로그인 토큰이 없습니다.');
          }

          handleExistingUser(result as ExistingUserResult);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : '카카오 로그인 중 오류가 발생했습니다.';

          console.error('카카오 로그인 API 호출 실패:', error);

          setErrorMessage(message);
          setIsLoading(false);
        }
      },

      fail: (error) => {
        console.error('카카오 로그인 실패:', error);

        setErrorMessage(
          error.error_description ||
            '카카오 로그인이 취소되었거나 실패했습니다.',
        );

        setIsLoading(false);
      },

      always: () => {
        window.setTimeout(() => {
          setIsLoading(false);
        }, 300);
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          AMOA.
        </h1>

        <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
          아트 디자인, 가격 한눈에 비교부터
          <br />
          예약까지 한번에
        </p>
      </div>

      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={handleKakaoLogin}
          disabled={!isKakaoReady || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 font-medium text-white transition active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <KakaoIcon />
              <span>카카오로 시작하기</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleGuestMode}
          disabled={isLoading}
          className="w-full rounded-full border border-[#E9EBEE] bg-white py-3.5 font-medium text-[#646F7C] transition active:bg-[#F7F8F9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          로그인 없이 둘러보기
        </button>
      </div>

      {errorMessage && (
        <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-label="로그인 처리 중"
    />
  );
}

function KakaoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.8 5.22 4.52 6.62-.2.73-.72 2.62-.82 3.03-.13.51.19.5.4.36.16-.1 2.6-1.76 3.65-2.47.71.1 1.45.16 2.25.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}

export default KakaoLoginPage;
