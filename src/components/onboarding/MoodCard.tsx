//A102 7개 무드 선택 카드
import { CheckIcon } from "../../assets/icons";
import { getMoodImage } from "./moodImages";

interface MoodCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function MoodCard({ label, selected, onClick }: MoodCardProps) {
  const imageSrc = getMoodImage(label);

  return (
    <button type="button" onClick={onClick} className="text-left">
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border ${
          selected ? "border-2 border-[#F70071] bg-white" : "border-gray-100 bg-gray-100"
        }`}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={label}
            className="h-full w-full object-cover"
          />
        )}
        {selected && (
          <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#F70071] text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-900">{label}</p>
    </button>
  );
}
