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
      contentClassName="w-[calc(100%-48px)] max-w-[340px] px-5 pb-5 pt-6"
    >
      <div className="text-center">
        <h2 className="text-lg font-bold text-[#171B1C]">
          로그인이 필요한 기능이에요
        </h2>

        <p className="mt-2 text-sm leading-5 text-[#646F7C]">
          카카오로 로그인하고
          <br />
          AMOA의 모든 기능을 이용해보세요.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleLoginClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3.5 text-sm font-bold text-[#171B1C] active:opacity-80"
        >
          <KakaoIcon />
          카카오톡으로 시작하기
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl py-3 text-sm font-medium text-[#646F7C] active:bg-[#F7F8F9]"
        >
          닫기
        </button>
      </div>
    </Modal>
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
