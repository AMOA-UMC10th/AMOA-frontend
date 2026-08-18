import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AmoaLogo from '../assets/AMOA3.png';
import Spinner from '../components/common/Spinner';

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

  const handleKakaoLogin = async (): Promise<void> => {
    if (!isKakaoReady || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await startKakaoLogin();

      saveKakaoLoginResult(result);

      if (result.isNewUser) {
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
    <div className="relative h-dvh w-full overflow-hidden bg-white">
      {/* AMOA 로고 */}
      <img
        src={AmoaLogo}
        alt="AMOA"
        className="
        absolute
        left-1/2
        top-[39.6%]
        w-[218px]
        h-auto
        -translate-x-1/2
        object-contain
      "
      />

      {/* 설명 */}
      <p
        className="
        absolute
        left-1/2
        top-[46.5%]
        w-[174px]
        -translate-x-1/2
        text-center
        text-[13px]
        font-medium
        leading-[150%]
        tracking-[0]
        text-[#646F7C]
      "
      >
        아트 디자인, 가격 한눈에 비교부터
        <br />
        예약까지 한번에
      </p>

      {/* 카카오 로그인 버튼 */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={!isKakaoReady || isLoading}
        className="
        absolute
        left-1/2
        top-[55%]
        flex
        h-[44px]
        w-[231px]
        -translate-x-1/2
        items-center
        justify-center
        rounded-[10px]
        bg-[#171B1C]
        transition-opacity
        active:opacity-80
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
      >
        {isLoading ? (
          <Spinner
            size={20}
            color="#FFFFFF"
            fadedColor="rgba(255, 255, 255, 0.5)"
            ariaLabel="로그인 처리 중"
          />
        ) : (
          <div className="flex h-[20px] items-center gap-[11px]">
            <KakaoIcon />

            <span className="whitespace-nowrap text-[13px] font-semibold leading-[150%] text-white">
              카카오로 로그인하기
            </span>
          </div>
        )}
      </button>

      {errorMessage && (
        <p
          className="
          absolute
          left-1/2
          top-[67%]
          w-[280px]
          -translate-x-1/2
          text-center
          text-[11px]
          text-[#F70071]
        "
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="16"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12 3C6.48 3 2 6.58 2 11C2 13.78 3.8 16.22 6.52 17.62C6.32 18.35 5.8 20.24 5.7 20.65C5.57 21.16 5.89 21.15 6.1 21.01C6.26 20.91 8.7 19.25 9.75 18.54C10.46 18.64 11.2 18.7 12 18.7C17.52 18.7 22 15.12 22 10.7C22 6.28 17.52 3 12 3Z"
        fill="#FDFDFD"
      />
    </svg>
  );
}

export default KakaoLoginPage;
