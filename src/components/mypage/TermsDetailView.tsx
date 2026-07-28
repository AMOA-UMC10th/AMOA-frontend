import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightSmallIcon } from '../../assets/icons';
import {
  fetchTermDetail,
  fetchTermList,
  type TermDetail,
  type TermListItem,
} from '../../data/terms';

export default function TermsDetailView() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<TermListItem[]>([]);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    fetchTermList()
      .then(setTerms)
      .catch((err) => {
        console.error(err);
        setListError('이용약관을 불러오지 못했어요');
      });
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setSelectedTerm(null);
      return;
    }

    setDetailError(null);
    fetchTermDetail(selectedId)
      .then(setSelectedTerm)
      .catch((err) => {
        console.error(err);
        setDetailError('이용약관을 불러오지 못했어요');
      });
  }, [selectedId]);

  if (selectedId !== null) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative flex items-center justify-center px-4 py-2.5 border-b border-[#E9EBEE]">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute left-4 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
          </button>
          <span className="text-base font-bold text-[#171B1C]">이용약관</span>
        </div>
        {detailError && (
          <p className="px-4 pt-6 text-sm text-[#F70071]">{detailError}</p>
        )}
        {selectedTerm && (
          <div className="px-4 pt-4 pb-6">
            <p className="text-base font-bold text-[#171B1C]">
              {selectedTerm.title}
            </p>
            <div className="border-t border-[#E9EBEE] mt-4 mb-5" />
            <p className="text-sm text-[#171B1C] whitespace-pre-line leading-relaxed">
              {selectedTerm.content}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center px-4 py-2.5 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-base font-bold text-[#171B1C]">이용약관</span>
      </div>
      {listError && (
        <p className="px-4 pt-6 text-sm text-[#F70071]">{listError}</p>
      )}
      <div className="divide-y divide-[#E9EBEE]">
        {terms.map((term) => (
          <button
            key={term.termId}
            type="button"
            onClick={() => setSelectedId(term.termId)}
            className="flex w-full items-center justify-between py-5 px-4 text-left"
          >
            <p className="text-base font-bold text-[#171B1C]">{term.title}</p>
            <ChevronRightSmallIcon className="w-2 h-3 text-[#ADB0B5] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
