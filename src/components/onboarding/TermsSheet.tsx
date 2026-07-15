// 약관동의 A106

import { useState } from 'react';
import TermCheckbox from './TermCheckbox';

interface Term {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  detailContent: string;
}

const initialTerms: Term[] = [
  {
    id: 'service',
    label: '서비스 이용약관 동의 (필수)',
    required: true,
    checked: false,
    detailContent: '서비스 이용약관 내용이 여기 들어갑니다.',
  },
  {
    id: 'privacy',
    label: '개인정보 처리방침 동의 (필수)',
    required: true,
    checked: false,
    detailContent: '개인정보 처리방침 내용이 여기 들어갑니다.',
  },
  {
    id: 'marketing',
    label: '마케팅 수신 동의 (선택)',
    required: false,
    checked: false,
    detailContent: '마케팅 수신 동의 관련 내용이 여기 들어갑니다.',
  },
];

function AllCheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
        checked ? 'bg-[#000000] border-[#000000]' : 'bg-white border-[#ADB0B5]'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke={checked ? '#FFFFFF' : '#ADB0B5'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface TermsSheetProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function TermsSheet({ onComplete, onClose }: TermsSheetProps) {
  const [terms, setTerms] = useState<Term[]>(initialTerms);

  const allChecked = terms.every((t) => t.checked);
  const isAllRequiredChecked = terms
    .filter((t) => t.required)
    .every((t) => t.checked);

  const handleToggleAll = () => {
    setTerms((prev) => prev.map((t) => ({ ...t, checked: !allChecked })));
  };

  const handleToggle = (id: string) => {
    setTerms((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)),
    );
  };

  const handleSignup = () => {
    if (!isAllRequiredChecked) return;
    // TODO: 백엔드에 약관 동의 정보 및 회원가입 완료 요청
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end justify-center z-40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-t-2xl px-6 pb-6 pt-10 min-h-[460px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[#28323C] mb-6 leading-[1.9]">
          AMOA 이용을 위해
          <br />
          약관에 동의해 주세요
        </h2>

        <p className="text-lg font-bold text-[#374553] pb-2 border-b border-[#171B1C]">
          이용약관
        </p>

        <div className="mt-3">
          {terms.map((term) => (
            <TermCheckbox key={term.id} term={term} onToggle={handleToggle} />
          ))}
        </div>

        <button
          onClick={handleToggleAll}
          className="w-full flex items-center gap-3 py-3.5 border-t border-[#C5C8CE] mt-1 mb-4"
        >
          <AllCheckIcon checked={allChecked} />
          <span className="text-sm font-bold text-[#646F7C]">
            모든 약관에 동의합니다
          </span>
        </button>

        <div className="flex-1" />

        <button
          onClick={handleSignup}
          disabled={!isAllRequiredChecked}
          className="w-full text-white text-sm rounded-lg py-3 bg-[#000000] disabled:bg-[#ADB0B5] disabled:text-white"
        >
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
}
