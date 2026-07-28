import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NicknameInput from '../../components/onboarding/NicknameInput';

export default function NicknamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerified = (verifiedNickname: string) => {
    setNickname(verifiedNickname);
    setIsVerified(true);
  };

  const handleNext = () => {
    if (!isVerified) return;
    navigate('/onboarding/phone', { state: { ...location.state, nickname } });
  };

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col h-full">
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
        닉네임을{'\n'}입력해 주세요
      </h1>
      <p className="text-sm text-[#646F7C] mt-2 mb-8">
        AMOA에서 사용할 이름이에요
      </p>

      <NicknameInput onVerified={handleVerified} />

      <div className="flex-1" />

      <button
        onClick={handleNext}
        disabled={!isVerified}
        className="bg-[#000000] text-white rounded-lg py-3 disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
      >
        다음
      </button>
    </div>
  );
}
