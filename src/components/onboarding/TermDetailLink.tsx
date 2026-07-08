import { useState } from 'react';

interface TermDetailLinkProps {
  label: string;
  content: string;
}

export default function TermDetailLink({
  label,
  content,
}: TermDetailLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm text-[#28323C]">{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="#ADB0B5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full max-h-[70vh] overflow-y-auto mx-6">
            <h2 className="text-lg font-bold mb-3">{label}</h2>
            <p className="text-sm text-[#646F7C] whitespace-pre-line">
              {content}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full bg-[#000000] text-white py-2 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
