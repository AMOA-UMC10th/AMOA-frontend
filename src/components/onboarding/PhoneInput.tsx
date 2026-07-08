//A105 전화번호 입력 및 인증 요청 버튼

import { useState } from 'react';
import AuthTimer from './AuthTimer';

interface PhoneInputProps {
  onVerified: () => void;
}

export default function PhoneInput({ onVerified }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = () => {
    // TODO: 백엔드 API 연동 (인증번호 요청)
    if (phone.length < 10) {
      setError('올바른 전화번호를 입력해주세요');
      return;
    }
    setError('');
    setIsCodeSent(true);
  };

  const handleVerify = () => {
    // TODO: 백엔드에 code 검증 요청
    if (code === '') {
      setError('인증번호를 입력해주세요');
      return;
    }
    onVerified();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="tel"
          placeholder="전화번호 입력"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={handleSendCode}
          className="bg-pink-500 text-white px-4 rounded-lg whitespace-nowrap"
        >
          인증요청
        </button>
      </div>

      {isCodeSent && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <AuthTimer duration={180} onExpire={() => setIsCodeSent(false)} />
          <button onClick={handleVerify} className="text-pink-500 font-medium">
            확인
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
