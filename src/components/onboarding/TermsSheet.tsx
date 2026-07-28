// 약관동의 A106

import { useEffect, useState } from 'react';
import TermCheckbox from './TermCheckbox';
import { fetchTermDetail, fetchTermList } from '../../data/terms';
import { saveOnboarding } from '../../data/onboarding';

interface Term {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  detailContent: string;
}

function AllCheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
        checked ? 'bg-[#F70071] border-[#F70071]' : 'bg-white border-[#ADB0B5]'
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
  nickname: string;
  phoneNumber: string;
  designTagIds: number[];
  regionIds: number[];
  onComplete: () => void;
  onClose: () => void;
}

export default function TermsSheet({
  nickname,
  phoneNumber,
  designTagIds,
  regionIds,
  onComplete,
  onClose,
}: TermsSheetProps) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTermList()
      .then(async (list) => {
        const withDetail = await Promise.all(
          list.map(async (item) => {
            let detailContent = '';
            try {
              const detail = await fetchTermDetail(item.termId);
              detailContent = detail.content;
            } catch (err) {
              console.error(err);
            }
            return {
              id: String(item.termId),
              label: item.required ? `${item.title} (필수)` : `${item.title} (선택)`,
              required: item.required,
              checked: false,
              detailContent,
            };
          }),
        );
        setTerms(withDetail);
      })
      .catch((err) => {
        console.error(err);
        setTerms([]);
      });
  }, []);

  const allChecked = terms.length > 0 && terms.every((t) => t.checked);
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

  const handleSignup = async () => {
    if (!isAllRequiredChecked || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await saveOnboarding({
        nickname,
        phoneNumber,
        designTagIds,
        regionIds,
        agreements: terms.map((t) => ({
          termId: Number(t.id),
          agreed: t.checked,
        })),
      });
      onComplete();
    } catch (err) {
      console.error(err);
      setError('가입 처리에 실패했어요. 다시 시도해주세요');
    } finally {
      setSubmitting(false);
    }
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

        {error && (
          <p className="mb-3 text-center text-xs text-[#CD0000]">{error}</p>
        )}

        <button
          onClick={handleSignup}
          disabled={!isAllRequiredChecked || submitting}
          className="w-full text-white text-sm rounded-lg py-3 bg-[#F70071] disabled:bg-[#FFC0DC] disabled:text-white"
        >
          {submitting ? '처리 중...' : '동의하고 가입하기'}
        </button>
      </div>
    </div>
  );
}
