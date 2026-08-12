//A103 동/지하철/구 검색창
import { SearchIcon, XIcon } from "../../assets/icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "구/동 이름으로 검색",
}: SearchBarProps) {
  return (
    // 설계서(A103)의 검색창은 테두리 없는 회색 필드다.
    <div className="flex items-center gap-2 rounded-xl bg-[#F4F5F7] px-4 py-3.5">
      <SearchIcon className="h-4.5 w-4.5 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#171B1C] placeholder:text-gray-400 focus:outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="검색어 지우기"
          className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#C9CDD2] text-white"
        >
          <XIcon className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}
