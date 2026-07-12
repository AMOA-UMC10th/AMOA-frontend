// G101 맞춤 추천 안내 배너

interface RecommendBannerProps {
  nickname: string;
  matchLabel: string; // 예: "화려한 무드 · 용산구 청파동"
  onMoreClick: () => void;
}

export default function RecommendBanner({
  nickname,
  matchLabel,
  onMoreClick,
}: RecommendBannerProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <h2 className="text-lg font-bold text-[#28323C]">
          {nickname}님을 위한 추천 이달아
        </h2>
        {matchLabel && (
          <p className="text-xs text-[#ADB0B5] mt-1">{matchLabel}</p>
        )}
      </div>
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
  );
}
