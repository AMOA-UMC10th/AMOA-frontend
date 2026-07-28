//A102 7개 무드 선택 카드
import { CheckIcon } from "../../assets/icons";

interface MoodCardProps {
  label: string;
  imageUrl?: string;
  selected: boolean;
  onClick: () => void;
}

export default function MoodCard({
  label,
  imageUrl,
  selected,
  onClick,
}: MoodCardProps) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      {/* 체크 배지가 카드 밖으로 걸쳐 있어서, 이미지 잘라내기(overflow-hidden)는 안쪽 상자에만 건다. */}
      <div className="relative aspect-square w-full">
        <div
          className={`h-full w-full overflow-hidden rounded-2xl border ${
            selected
              ? "border-2 border-[#F70071] bg-white"
              : "border-gray-100 bg-gray-100"
          }`}
        >
          {imageUrl && (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        {selected && (
          <span className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#F70071] text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-900">{label}</p>
    </button>
  );
}
