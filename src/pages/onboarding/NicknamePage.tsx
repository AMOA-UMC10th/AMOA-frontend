import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NicknameInput from '../../components/onboarding/NicknameInput';
import { ChevronLeftIcon } from '../../assets/icons';

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
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/onboarding/region', { state: location.state })}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">서비스 시작하기</h1>
      </header>

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-xl font-bold leading-relaxed whitespace-pre-line text-gray-900">
          닉네임을{'\n'}입력해 주세요
        </h2>
        <p className="mt-2 text-sm text-gray-400">AMOA에서 사용할 이름이에요</p>

        <div className="mt-6">
          <NicknameInput onVerified={handleVerified} />
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isVerified}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            isVerified ? 'bg-[#F70071]' : 'bg-[#FFC0DC]'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
