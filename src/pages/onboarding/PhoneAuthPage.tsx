//전화번호 입력 페이지 A105

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from '../../components/onboarding/PhoneInput';
import AuthTimer from '../../components/onboarding/AuthTimer';
import VerificationCodeInput from '../../components/onboarding/VerificationCodeInput';

type SubStep = 'phone' | 'code' | 'done';
const stepIndex: Record<SubStep, number> = {
  phone: 0,
  code: 1,
  done: 2,
};

export default function PhoneAuthPage() {
  const navigate = useNavigate();
  const [subStep, setSubStep] = useState<SubStep>('phone');
  const [code, setCode] = useState<string[]>(Array(6).fill(''));

  const isCodeComplete = code.every((d) => d !== '');

  const handleRequestCode = (_phone: string) => {
    // TODO: 백엔드에 SMS 발송 요청
    setSubStep('code');
  };

  const handleResend = () => {
    // TODO: 인증번호 재전송 요청
    setCode(Array(6).fill(''));
  };

  const handleVerify = () => {
    if (!isCodeComplete) return;
    // TODO: 백엔드에 인증번호 검증 요청
    setSubStep('done');
  };

  const handleSkip = () => navigate('/onboarding/terms');
  const handleStart = () => navigate('/onboarding/terms');

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col min-h-screen">
      <div className="flex gap-1 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= stepIndex[subStep] ? 'bg-[#000000]' : 'bg-[#E9EBEE]'
            }`}
          />
        ))}
      </div>

      {subStep === 'phone' && (
        <PhoneInput onRequestCode={handleRequestCode} onSkip={handleSkip} />
      )}

      {subStep === 'code' && (
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold mb-6 whitespace-pre-line">
            문자로 받은{'\n'}인증번호 6자리를 알려주세요
          </h1>

          <VerificationCodeInput value={code} onChange={setCode} />

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleResend}
              className="text-[#ADB0B5] text-sm underline"
            >
              인증번호 재전송
            </button>
            <AuthTimer duration={180} onExpire={handleResend} />
          </div>

          <div className="flex-1" />

          <button
            onClick={handleSkip}
            className="text-[#ADB0B5] text-sm mb-4 self-center"
          >
            건너뛰기
          </button>
          <button
            onClick={handleVerify}
            disabled={!isCodeComplete}
            className="bg-[#000000] text-white rounded-lg py-3 disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}

      {subStep === 'done' && (
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold mb-6">인증이 완료됐어요</h1>
          <VerificationCodeInput
            value={code}
            onChange={() => {}}
            variant="success"
          />
          <div className="flex-1" />
          <button
            onClick={handleStart}
            className="bg-[#22C55E] text-white rounded-lg py-3"
          >
            AMOA 시작하기
          </button>
        </div>
      )}
    </div>
  );
}
