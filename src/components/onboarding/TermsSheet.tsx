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
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
        checked ? 'bg-[#000000]' : 'bg-[#E9EBEE]'
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
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-40">
      <div
        className="w-full max-w-sm bg-white rounded-t-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleToggleAll}
          className="w-full flex items-center gap-3 py-3 border-b border-[#E9EBEE] mb-1"
        >
          <AllCheckIcon checked={allChecked} />
          <span className="font-bold text-[#28323C]">
            AMOA 이용약관 전체동의
          </span>
        </button>

        {terms.map((term) => (
          <TermCheckbox key={term.id} term={term} onToggle={handleToggle} />
        ))}

        <button
          onClick={handleSignup}
          disabled={!isAllRequiredChecked}
          className="mt-4 w-full bg-[#000000] text-white rounded-lg py-3 disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
        >
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
}
