//A105 전화번호 입력 및 인증 요청 버튼

import { useState } from 'react';

interface PhoneInputProps {
  onRequestCode: (phone: string) => void;
  onSkip: () => void;
}

function formatPhoneNumber(input: string) {
  const digits = input.replace(/[^0-9]/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function PhoneInput({ onRequestCode, onSkip }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const isValid = phone.replace(/[^0-9]/g, '').length === 11;

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-xl font-bold mb-1">휴대폰번호를 입력해주세요</h1>
      <p className="text-sm text-[#646F7C] mb-6">
        인증을 위한 전화번호를 입력해주세요
      </p>

      <input
        type="tel"
        placeholder="010-0000-0000"
        value={phone}
        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
        className="border border-[#E9EBEE] rounded-lg px-4 py-3 mb-3"
      />

      <button
        onClick={() => isValid && onRequestCode(phone)}
        disabled={!isValid}
        className="border border-[#000000] text-[#000000] rounded-lg py-3 disabled:opacity-30"
      >
        인증번호 받기
      </button>

      <div className="flex-1" />

      <button
        onClick={onSkip}
        className="text-[#ADB0B5] text-sm mb-4 self-center"
      >
        건너뛰기
      </button>
      <button
        disabled
        className="bg-[#000000] text-white rounded-lg py-3 disabled:opacity-30"
      >
        다음
      </button>
    </div>
  );
}
