//전화번호 입력 페이지 A105

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
    <div className="max-w-sm mx-auto p-6 flex flex-col min-h-screen">
      <div className="relative flex items-center justify-center mb-8 pb-4 border-b border-[#E9EBEE]">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 p-1"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#28323C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-sm text-[#000000] font-bold">
          서비스 시작하기
        </span>
      </div>

      <h1 className="text-xl font-bold leading-relaxed whitespace-pre-line">
        전화번호를{'\n'}인증해주세요
      </h1>
      <p className="text-sm font-semibold text-[#646F7C] mt-2 mb-8">
        추후 간편한 예약을 위해 필요해요
      </p>

      <div className="flex flex-col gap-2 mb-8">
        <label className="text-sm text-[#ADB0B5]">닉네임</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={nickname}
            disabled
            className="flex-1 border-b border-[#E9EBEE] px-1 py-2 text-[#ADB0B5]"
          />
          <button
            disabled
            className="w-24 h-10 rounded-lg text-sm whitespace-nowrap flex items-center justify-center bg-[#FFC0DC] text-white"
          >
            확인완료
          </button>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#ADB0B5]">2~10자, 한글/영문/숫자</span>
          <span className="text-xs text-[#ADB0B5]">{nickname.length}/10</span>
        </div>
      </div>

      <PhoneInput onVerified={handleVerified} />

      <div className="flex-1" />

      <button
        onClick={handleNext}
        disabled={!isPhoneVerified}
        className="bg-[#F70071] text-white rounded-lg py-3 disabled:bg-[#FFC0DC] disabled:text-white"
      >
        다음
      </button>

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