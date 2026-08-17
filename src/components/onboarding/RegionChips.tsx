import { XIcon } from "../../assets/icons";
import { stripSido } from "../../data/region";

export interface SelectedRegion {
  id: string;
  regionId?: number;
  district?: string;
  keyword?: string;
  label?: string;
}

interface RegionChipsProps {
  regions: SelectedRegion[];
  onRemove: (id: string) => void;
}

export default function RegionChips({ regions, onRemove }: RegionChipsProps) {
  if (regions.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs text-gray-400">선택된 위치</p>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => {
          // "서울시 성동구" → "성동구", "경기도 성남시 분당구" → "성남시 분당구"
          const sigungu = region.district ? stripSido(region.district) : "";
          const displayText = sigungu && region.keyword
            ? `${sigungu} ${region.keyword}`
            : region.label || "";

          return (
            <span
              key={region.id}
              className="flex items-center gap-1.5 rounded-full bg-[#F70071] py-2 pl-4 pr-3 text-sm text-white"
            >
              {displayText}
              <button
                type="button"
                onClick={() => onRemove(region.id)}
                aria-label={`${displayText} 삭제`}
                className="text-white/70 hover:text-white"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}