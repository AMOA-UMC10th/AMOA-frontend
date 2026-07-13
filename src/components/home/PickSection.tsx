// G101 완벽한 연말을 위한 PICK 섹션

import RecommendArtList from './RecommendArtList';
import type { RecommendArt } from '../../data/homeData';

interface PickSectionProps {
  title: string;
  highlightWord: string;
  items: RecommendArt[];
  onMoreClick: () => void;
}

export default function PickSection({
  title,
  highlightWord,
  items,
  onMoreClick,
}: PickSectionProps) {
  const parts = title.split(highlightWord);

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-lg font-bold text-[#28323C]">
          {parts[0]}
          <span className="text-[#FF1B82]">{highlightWord}</span>
          {parts[1]}
        </h3>
        <button
          onClick={onMoreClick}
          className="flex items-center text-sm text-[#ADB0B5]"
        >
          더보기
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
      </div>
      <RecommendArtList items={items} />
    </div>
  );
}
