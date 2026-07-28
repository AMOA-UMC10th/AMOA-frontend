//전화번호 입력 페이지 A105

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneInput from '../../components/onboarding/PhoneInput';
import TermsSheet from '../../components/onboarding/TermsSheet';
import { ChevronLeftIcon } from '../../assets/icons';

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
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/onboarding/nickname', { state: location.state })}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">서비스 시작하기</h1>
      </header>

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-xl font-bold leading-relaxed whitespace-pre-line text-gray-900">
          전화번호를{'\n'}인증해주세요
        </h2>
        <p className="mt-2 text-sm font-semibold text-gray-400">
          추후 간편한 예약을 위해 필요해요
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <label className="text-sm text-[#ADB0B5]">닉네임</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nickname}
              disabled
              className="flex-1 border-b border-[#E9EBEE] px-1 py-2 text-[#ADB0B5]"
            />
            <button
              disabled
              className="flex h-10 w-24 items-center justify-center whitespace-nowrap rounded-lg bg-[#FFC0DC] text-sm text-white"
            >
              확인완료
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-[#ADB0B5]">2~10자, 한글/영문/숫자</span>
            <span className="text-xs text-[#ADB0B5]">{nickname.length}/10</span>
          </div>
        </div>

        <div className="mt-6">
          <PhoneInput onVerified={handleVerified} />
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isPhoneVerified}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            isPhoneVerified ? 'bg-[#F70071]' : 'bg-[#FFC0DC]'
          }`}
        >
          다음
        </button>
      </div>

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
