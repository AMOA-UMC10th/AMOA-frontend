import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneInput from '../../components/onboarding/PhoneInput';
import TermsSheet from '../../components/onboarding/TermsSheet';

interface LocationState {
  nickname?: string;
  designTagIds?: number[];
  regionIds?: number[];
}

export default function PhoneAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const state = location.state as LocationState | null;
  const nickname = state?.nickname ?? '';
  const designTagIds = state?.designTagIds ?? [];
  const regionIds = state?.regionIds ?? [];

  const handleVerified = (phone: string) => {
    setPhoneNumber(phone);
    setIsPhoneVerified(true);
  };

  const handleNext = () => {
    if (!isPhoneVerified) return;
    setShowTerms(true);
  };

  const handleSignupComplete = () => {
    navigate('/onboarding/complete');
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
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
            전화번호를
            <br />
            인증해 주세요
          </h1>

          <p className="mt-[7px] text-[13px] font-medium leading-[1.5] text-[#646F7C]">
            추후 간편한 예약을 위해 필요해요
          </p>

          <div className="mt-[42px] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#ADB0B5]">닉네임</label>
              <div className="flex items-end gap-[9px]">
                <input
                  type="text"
                  value={nickname}
                  disabled
                  className="h-11 min-w-0 flex-1 border-b border-[#E9EBEE] bg-transparent px-0 pt-[14px] pb-[14px] text-[13px] font-medium text-[#ADB0B5] outline-none"
                />
                <button
                  disabled
                  type="button"
                  className="h-[38px] w-[81px] shrink-0 rounded-[7px] text-[13px] whitespace-nowrap flex items-center justify-center bg-[#FFC0DC] text-white cursor-default"
                >
                  확인완료
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#ADB0B5]">
                  2~10자, 한글/영문/숫자
                </span>
                <span className="text-xs text-[#ADB0B5]">
                  {nickname.length}/10
                </span>
              </div>
            </div>

            <PhoneInput onVerified={handleVerified} />
          </div>
        </section>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleNext}
          disabled={!isPhoneVerified}
          className={`h-[52px] w-full rounded-[10px] text-[15px]
            font-medium text-white transition-colors
            ${isPhoneVerified ? 'bg-[#F70071]' : 'cursor-not-allowed bg-[#FFC0DC]'}
          `}
        >
          다음
        </button>
      </main>

      {showTerms && (
        <TermsSheet
          nickname={nickname}
          phoneNumber={phoneNumber}
          designTagIds={designTagIds}
          regionIds={regionIds}
          onComplete={handleSignupComplete}
          onClose={() => setShowTerms(false)}
        />
      )}
    </div>
  );
}