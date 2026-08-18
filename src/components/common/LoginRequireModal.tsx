import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginModalImage from '../../assets/LoginModalImage.png';
import Modal from './Modal';
import Spinner from './Spinner';

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

  const handleClose = (): void => {
    if (isLoading) {
      return;
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="
        relative
        !h-[261px]
        !w-[316px]
        !max-w-[calc(100%-48px)]
        !overflow-hidden
        !rounded-[23px]
        !bg-white
        !p-0
      "
    >
      <button
        type="button"
        onClick={handleClose}
        disabled={isLoading}
        aria-label="닫기"
        className="
          absolute
          right-[22px]
          top-[20px]
          z-10
          flex
          h-[8px]
          w-[8px]
          items-center
          justify-center
          disabled:cursor-not-allowed
        "
      >
        <CloseIcon />
      </button>

      <img
        src={LoginModalImage}
        alt=""
        aria-hidden="true"
        className="
    absolute
    left-1/2
    top-[30px]
    h-[68px]
    w-[68px]
    -translate-x-1/2
    object-contain
    brightness-[1.18]
    saturate-[1.12]
    contrast-[0.9]
  "
      />

      <h2
        className="
          absolute
          left-1/2
          top-[114px]
          flex
          h-[36px]
          w-[166px]
          -translate-x-1/2
          items-center
          justify-center
          text-center
          text-[15px]
          font-bold
          leading-[18px]
          tracking-[0]
          text-black
        "
      >
        <span>
          카카오 계정으로 로그인하고
          <br />더 많은 기능을 이용해보세요
        </span>
      </h2>

      <p
        className="
          absolute
          left-1/2
          top-[157px]
          h-[18px]
          w-[250px]
          -translate-x-1/2
          whitespace-nowrap
          text-center
          text-[10.5px]
          font-normal
          leading-[18px]
          tracking-[0]
          text-[#888888]
        "
      >
        현재 아트 맞춤 추천, 아트 찾기, 찜 기능을 모두 놓치고 있어요
      </p>

      <button
        type="button"
        onClick={handleLoginClick}
        disabled={isLoading}
        className="
          absolute
          left-1/2
          top-[195px]
          flex
          h-[39px]
          w-[264px]
          -translate-x-1/2
          items-center
          justify-center
          gap-[9px]
          rounded-[8px]
          bg-[#FEE500]
          text-[12px]
          font-semibold
          leading-[11.82px]
          tracking-[0]
          text-black
          active:opacity-80
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {isLoading ? (
          <Spinner
            size={20}
            color="#1E1E1E"
            fadedColor="rgba(30, 30, 30, 0.25)"
            ariaLabel="로그인 처리 중"
          />
        ) : (
          <>
            <KakaoIcon />

            <span className="whitespace-nowrap">카카오톡으로 시작하기</span>
          </>
        )}
      </button>
    </Modal>
  );
}

function CloseIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0.75 0.75L7.25 7.25M7.25 0.75L0.75 7.25"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="13"
      height="12"
      viewBox="0 0 13 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6.5 0.75C3.186 0.75 0.5 2.857 0.5 5.456C0.5 7.084 1.566 8.52 3.186 9.364C3.066 9.808 2.754 10.952 2.694 11.15C2.616 11.462 2.808 11.456 2.934 11.372C3.03 11.312 4.494 10.306 5.124 9.88C5.55 9.94 5.994 9.976 6.5 9.976C9.814 9.976 12.5 7.869 12.5 5.27C12.5 2.671 9.814 0.75 6.5 0.75Z"
        fill="#1E1E1E"
      />
    </svg>
  );
}
