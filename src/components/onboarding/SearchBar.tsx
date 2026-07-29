//A103 동/지하철/구 검색창
import { SearchIcon, XIcon } from "../../assets/icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  // 화면마다 안내 문구가 달라서 열어둔다. (온보딩 A103 / 마이페이지 재설정 F104)
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "구/동 이름으로 검색",
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
      <SearchIcon className="h-4.5 w-4.5 shrink-0 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
