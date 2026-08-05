import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from './Modal';

import {
  saveKakaoLoginResult,
  startKakaoLogin,
} from '../../data/userdata/kakaoLogin';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
}: LoginRequiredModalProps) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await startKakaoLogin();

      saveKakaoLoginResult(result);
      onClose();

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
      console.error('카카오 로그인 실패:', error);

      const message =
        error instanceof Error
          ? error.message
          : '카카오 로그인 중 오류가 발생했습니다.';

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) {
      return;
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="relative w-[calc(100%-48px)] max-w-[408px] rounded-[30px] px-[34px] pb-[34px] pt-[28px]"
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={isLoading}
        aria-label="닫기"
        className="absolute right-[23px] top-[20px] flex h-6 w-6 items-center justify-center disabled:cursor-not-allowed"
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="#171B1C"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="mt-[23px] flex h-[82px] w-[82px] items-center justify-center">
          <HeartImage />
        </div>

        <h2 className="mt-[27px] text-[18px] font-bold leading-[24px] text-[#171B1C]">
          카카오 계정으로 로그인하고
          <br />더 많은 기능을 이용해보세요
        </h2>

        <p className="mt-[15px] whitespace-nowrap text-[12px] leading-[18px] text-[#ADB0B5]">
          현재 아트 맞춤 추천, 아트 찾기, 찜 기능을 모두 놓치고 있어요
        </p>
      </div>

      <button
        type="button"
        onClick={handleLoginClick}
        disabled={isLoading}
        className="mt-[28px] flex h-[52px] w-full items-center justify-center gap-[11px] rounded-[12px] bg-[#FEE500] text-[15px] font-bold text-[#171B1C] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <KakaoIcon />
            <span>카카오톡으로 시작하기</span>
          </>
        )}
      </button>
    </Modal>
  );
}

function LoadingSpinner() {
  return (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-[#171B1C]/30 border-t-[#171B1C]"
      role="status"
      aria-label="로그인 처리 중"
    />
  );
}

function HeartImage() {
  return (
    <svg
      width="82"
      height="82"
      viewBox="0 0 82 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="loginHeartGradient"
          x1="25"
          y1="12"
          x2="57"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9FC7" />
          <stop offset="0.42" stopColor="#E83C79" />
          <stop offset="1" stopColor="#A70E43" />
        </linearGradient>

        <radialGradient
          id="loginHeartHighlight"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(31 25) rotate(45) scale(24)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M41 72C36.5 68.8 17 55.8 17 35C17 22.8 24.6 15 34.5 15C40 15 44.5 18.3 47.5 22.8C50.5 18.3 55 15 61 15C70.8 15 76.3 23.8 75 35C72.8 54 54.3 68 41 72Z"
        fill="url(#loginHeartGradient)"
      />

      <ellipse
        cx="31"
        cy="26"
        rx="13"
        ry="11"
        fill="url(#loginHeartHighlight)"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="#171B1C"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.8 5.22 4.52 6.62-.2.73-.72 2.62-.82 3.03-.13.51.19.5.4.36.16-.1 2.6-1.76 3.65-2.47.71.1 1.45.16 2.25.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}
