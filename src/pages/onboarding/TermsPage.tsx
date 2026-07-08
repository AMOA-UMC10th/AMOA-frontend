//약관동의 A106

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TermCheckbox from '../../components/onboarding/TermCheckbox';

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
    label: '서비스 이용약관 동의',
    required: true,
    checked: false,
    detailContent: '서비스 이용약관 내용이 여기 들어갑니다.',
  },
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    required: true,
    checked: false,
    detailContent: '개인정보 수집 및 이용 관련 내용이 여기 들어갑니다.',
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의',
    required: false,
    checked: false,
    detailContent: '마케팅 정보 수신 관련 내용이 여기 들어갑니다.',
  },
];

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const navigate = useNavigate();

  const handleToggle = (id: string) => {
    setTerms((prev) =>
      prev.map((term) =>
        term.id === id ? { ...term, checked: !term.checked } : term,
      ),
    );
  };

  const handleToggleAll = () => {
    const allChecked = terms.every((term) => term.checked);
    setTerms((prev) => prev.map((term) => ({ ...term, checked: !allChecked })));
  };

  const isAllRequiredChecked = terms
    .filter((term) => term.required)
    .every((term) => term.checked);

  const handleNext = () => {
    // TODO: 백엔드에 약관 동의 정보 전송
    navigate('/'); // 홈으로 이동
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">약관 동의</h1>

      <div className="flex items-center gap-2 py-3 border-b-2 font-medium">
        <input
          type="checkbox"
          checked={terms.every((term) => term.checked)}
          onChange={handleToggleAll}
        />
        <span>전체 동의</span>
      </div>

      {terms.map((term) => (
        <TermCheckbox key={term.id} term={term} onToggle={handleToggle} />
      ))}

      <button
        onClick={handleNext}
        disabled={!isAllRequiredChecked}
        className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg disabled:opacity-40"
      >
        다음
      </button>
    </div>
  );
}
