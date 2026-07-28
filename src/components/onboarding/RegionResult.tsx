//A103 검색 결과 리스트

import { SearchIcon } from "../../assets/icons";
import type { RegionMatch } from "../../data/region";

interface RegionResultProps {
  results: RegionMatch[];
  onSelect: (match: RegionMatch) => void;
}

export default function RegionResult({ results, onSelect }: RegionResultProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-1 py-16 text-center">
        <SearchIcon className="h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm font-bold text-gray-900">검색 결과가 없어요</p>
        <p className="text-xs text-gray-400">다른 동네 이름으로 검색해보세요</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {results.map((match) => (
        <li key={match.id}>
          <button
            type="button"
            onClick={() => onSelect(match)}
            className="w-full py-3.5 text-left"
          >
            <span className="text-sm text-gray-900">
              {match.district} {match.keyword}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
