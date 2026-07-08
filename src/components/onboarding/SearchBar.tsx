//A103 동/지하철/구 검색창
import { SearchIcon, XIcon } from "./icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
      <SearchIcon className="h-4.5 w-4.5 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="동, 지하철역 이름으로 검색"
        className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="검색어 지우기"
          className="shrink-0 text-gray-300 hover:text-gray-400"
        >
          <XIcon className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
