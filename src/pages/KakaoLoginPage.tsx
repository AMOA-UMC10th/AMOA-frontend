import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  initializeKakaoSdk,
  saveKakaoLoginResult,
  startKakaoLogin,
} from '../data/userdata/kakaoLogin';

function KakaoLoginPage() {
  const navigate = useNavigate();

  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const prepareKakaoLogin = async () => {
      try {
        await initializeKakaoSdk();

        if (!cancelled) {
          setIsKakaoReady(true);
          setErrorMessage(null);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : '카카오 로그인 기능을 불러오지 못했습니다.';

        console.error('카카오 SDK 초기화 실패:', error);
        setErrorMessage(message);
      }
    };

    prepareKakaoLogin();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleGuestMode = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('memberId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickName');
    localStorage.removeItem('kakaoEmail');

    localStorage.setItem('isGuest', 'true');

    navigate('/home', {
      replace: true,
    });
  };

  const handleKakaoLogin = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await startKakaoLogin();

      saveKakaoLoginResult(result);

      if (result.isNewUser || !result.onboarding_completed) {
        navigate('/onboarding/design', {
          replace: true,
        });

        return;
      }

      navigate('/home', {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '카카오 로그인 중 오류가 발생했습니다.';

      console.error('카카오 로그인 실패:', error);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
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
