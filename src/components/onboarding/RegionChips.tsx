//A103 선택된 구 단위 Chip 영역
import { XIcon } from "./icons";

export interface SelectedRegion {
  id: string;
  label: string;
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
        {regions.map((region) => (
          <span
            key={region.id}
            className="flex items-center gap-1.5 rounded-full bg-black py-2 pl-4 pr-3 text-sm text-white"
          >
            {region.label}
            <button
              type="button"
              onClick={() => onRemove(region.id)}
              aria-label={`${region.label} 삭제`}
              className="text-white/70 hover:text-white"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
