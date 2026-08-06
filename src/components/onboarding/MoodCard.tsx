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
      <div className="relative aspect-square w-full">
        <div
          className={`h-full w-full overflow-hidden rounded-xl border ${
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
          <span className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#F70071] text-white">
            <CheckIcon className="h-3 w-3" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-[#171B1C]">{label}</p>
    </button>
  );
}