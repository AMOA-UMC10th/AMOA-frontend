//A105 전화번호 입력 및 인증 요청 버튼

import { useState } from 'react';
import AuthTimer from './AuthTimer';
import { sendPhoneCode, verifyPhoneCode } from '../../data/userdata/user';

interface PhoneInputProps {
  onVerified: (phone: string) => void;
}

function formatPhoneNumber(input: string) {
  const digits = input.replace(/[^0-9]/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function PhoneInput({ onVerified }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isRequested, setIsRequested] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPhoneValid = phone.replace(/[^0-9]/g, '').length === 11;
  const isCodeValid = code.length === 6;

  const handleRequestCode = async () => {
    if (!isPhoneValid || isVerified || isSending) return;
    setIsSending(true);
    setErrorMessage(null);
    try {
      await sendPhoneCode(phone);
      setIsRequested(true);
      setCode('');
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : '인증번호 발송에 실패했어요');
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = () => {
    setCode('');
    handleRequestCode();
  };

  const handleVerify = async () => {
    if (!isCodeValid || isVerifying) return;
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const { verified } = await verifyPhoneCode(phone, code);
      if (!verified) {
        setErrorMessage('인증번호가 올바르지 않아요');
        return;
      }
      setIsVerified(true);
      onVerified(phone.replace(/[^0-9]/g, ''));
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : '인증번호 확인에 실패했어요');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[#28323C] font-medium">전화번호</label>
      <div className="flex gap-2">
        <input
          type="tel"
          placeholder="010-0000-0000"
          value={phone}
          disabled={isVerified}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          className="flex-1 border-b border-[#E9EBEE] px-1 py-2 outline-none disabled:text-[#ADB0B5]"
        />
        <button
          onClick={handleRequestCode}
          disabled={!isPhoneValid || isVerified || isSending}
          className="w-24 h-10 rounded-lg text-sm whitespace-nowrap bg-[#F70071] text-white disabled:bg-[#FFC0DC] disabled:text-white"
        >
          {isVerified ? '인증완료' : isSending ? '발송중...' : '인증받기'}
        </button>
      </div>

      {isVerified && (
        <p className="text-xs text-[#ADB0B5]">전화번호 인증이 완료되었어요</p>
      )}

      {errorMessage && (
        <p className="text-xs text-[#F70071]">{errorMessage}</p>
      )}

      {isRequested && !isVerified && (
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm text-[#28323C] font-medium">인증번호</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6자리 입력"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full border-b border-[#E9EBEE] px-1 py-2 pr-12 outline-none"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <AuthTimer duration={180} onExpire={handleResend} />
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={!isCodeValid || isVerifying}
              className="w-24 h-10 rounded-lg text-sm whitespace-nowrap bg-[#F70071] text-white disabled:bg-[#FFC0DC] disabled:text-white"
            >
              {isVerifying ? '확인중...' : '확인완료'}
            </button>
          </div>
          <span className="text-xs text-[#ADB0B5]">
            인증번호가 오지 않았나요?{' '}
            <button onClick={handleResend} className="text-[#000000] underline">
              재전송
            </button>
          </span>
        </div>
      )}
    </div>
  );
}