//A106 약관 항목별 상세보기 링크/팝업

import { useState } from 'react';

interface TermDetailLinkProps {
  title: string;
  content: string;
}

export default function TermDetailLink({
  title,
  content,
}: TermDetailLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-400 text-sm underline"
      >
        보기
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {content}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
