import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightThinIcon } from '../../assets/icons';
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

  // 마이페이지 > 이용약관 노출 순서 (화면설계서 기준, API 응답 순서와 다름)
  const TERM_ORDER = [
    '서비스 이용약관',
    '개인정보 수집·이용',
    '개인정보 처리방침',
    '취소/환불 규정',
    '마케팅 수신',
  ];

  useEffect(() => {
    fetchTermList()
      .then((list) => {
        const sorted = [...list].sort(
          (a, b) => TERM_ORDER.indexOf(a.title) - TERM_ORDER.indexOf(b.title),
        );
        setTerms(sorted);
      })
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
        <div className="relative flex items-center justify-center h-11 px-4 border-b border-[#E9EBEE]">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute left-4 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5 text-[#646F7C]" />
          </button>
          <span className="text-[13px] font-semibold text-black">이용약관</span>
        </div>
        {detailError && (
          <p className="px-4 pt-6 text-sm text-[#F70071]">{detailError}</p>
        )}
        {selectedTerm && (
          <div>
            <div className="px-6 py-3">
              <p className="text-[17px] font-semibold text-[#171B1C]">
                {selectedTerm.title}
              </p>
            </div>
            <div className="border-t border-[#D4D7DC] mx-6" />
            <p className="text-[13px] font-medium text-[#171B1C] whitespace-pre-line leading-relaxed px-6 py-4">
              {selectedTerm.content}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center h-11 px-4 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#646F7C]" />
        </button>
        <span className="text-[13px] font-semibold text-black">이용약관</span>
      </div>
      {listError && (
        <p className="px-4 pt-6 text-sm text-[#F70071]">{listError}</p>
      )}
      <div>
        {terms.map((term) => (
          <button
            key={term.termId}
            type="button"
            onClick={() => setSelectedId(term.termId)}
            className="flex w-full items-center justify-between py-3 px-6 text-left border-b border-[#C5C8CE]"
          >
            <p className="text-[15px] font-medium text-[#171B1C]">{term.title}</p>
            <ChevronRightThinIcon className="w-4 h-4 text-[#CCCCCC] shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
