import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NicknameInput from '../../components/onboarding/NicknameInput';

interface LocationState {
  designTagIds?: number[];
  regionIds?: number[];
}

export default function NicknamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [nickname, setNickname] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerified = (verifiedNickname: string) => {
    setNickname(verifiedNickname);
    setIsVerified(true);
  };

  const handleVerificationReset = () => {
    setNickname('');
    setIsVerified(false);
  };

  const handleNext = () => {
    if (!isVerified) return;

    navigate('/onboarding/phone', {
      state: {
        ...state,
        nickname,
      },
    });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] px-5">
        <button
          type="button"
          onClick={() => navigate('/onboarding/region')}
          className="absolute left-3.5 flex h-10 w-10 items-center justify-start"
          aria-label="뒤로가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#171B1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className="text-[13px] font-semibold text-[#000000]">
          서비스 시작하기
        </h2>
      </header>

      <main className="flex flex-1 flex-col px-[24px] pb-[29px] pt-[42px]">
        <section>
          <h1 className="text-[21px] font-semibold leading-[1.5] text-[#000000]">
            닉네임을
            <br />
            입력해 주세요
          </h1>

          <p className="mt-[7px] text-[13px] font-medium leading-[1.5] text-[#646F7C]">
            AMOA에서 사용할 이름이에요
          </p>

          <div className="mt-[42px]">
            <NicknameInput
              onVerified={handleVerified}
              onVerificationReset={handleVerificationReset}
            />
          </div>
        </section>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleNext}
          disabled={!isVerified}
          className={`h-[52px] w-full rounded-[10px] text-[15px]
            font-medium text-white transition-colors
            ${isVerified ? 'bg-[#F70071]' : 'cursor-not-allowed bg-[#FFC0DC]'}
          `}
        >
          다음
        </button>
      </main>
    </div>
  );
}
