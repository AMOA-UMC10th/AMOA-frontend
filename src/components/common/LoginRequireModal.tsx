import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
}: LoginRequiredModalProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();

    navigate('/login', {
      state: {
        fromLoginRequiredModal: true,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="relative w-[calc(100%-48px)] max-w-[340px] px-5 pb-5 pt-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="#171B1C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="mt-6 flex h-20 w-20 items-center justify-center">
          <HeartImage />
        </div>

        <h2 className="mt-6 text-lg font-bold leading-6 text-[#171B1C]">
          카카오 계정으로 로그인하고
          <br />더 많은 기능을 이용해보세요
        </h2>

        <p className="mt-3 text-xs leading-5 text-[#ADB0B5]">
          현재 아트 맞춤 추천, 아트 찾기, 찜 기능을 모두 놓치고 있어요
        </p>
      </div>

      <button
        type="button"
        onClick={handleLoginClick}
        className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] py-3.5 text-sm font-bold text-[#171B1C] active:opacity-80"
      >
        <KakaoIcon />
        카카오톡으로 시작하기
      </button>
    </Modal>
  );
}

function HeartImage() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="heartGradient"
          x1="23"
          y1="13"
          x2="54"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9CC5" />
          <stop offset="0.45" stopColor="#E13A75" />
          <stop offset="1" stopColor="#A71345" />
        </linearGradient>

        <radialGradient
          id="heartHighlight"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(29 25) rotate(45) scale(22)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.9" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M38 66C34 63 16 51 16 32C16 21 23 14 32 14C37 14 41 17 44 21C47 17 51 14 57 14C66 14 71 22 70 32C68 49 51 62 38 66Z"
        fill="url(#heartGradient)"
      />

      <ellipse cx="30" cy="25" rx="12" ry="10" fill="url(#heartHighlight)" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#171B1C"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.8 5.22 4.52 6.62-.2.73-.72 2.62-.82 3.03-.13.51.19.5.4.36.16-.1 2.6-1.76 3.65-2.47.71.1 1.45.16 2.25.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}
