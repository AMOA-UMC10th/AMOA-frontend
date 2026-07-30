//A103 검색 결과 리스트

import { SearchIcon } from "../../assets/icons";
import type { RegionMatch } from "../../data/region";

interface RegionResultProps {
  results: RegionMatch[];
  loading?: boolean;
  onSelect: (match: RegionMatch) => void;
}

export default function RegionResult({
  results,
  loading = false,
  onSelect,
}: RegionResultProps) {
  // 검색 중에는 결과 없음 문구를 띄우지 않는다. 응답 전까지 results가 비어 있어서
  // 글자를 칠 때마다 "검색 결과가 없어요"가 먼저 깜빡이던 문제를 막는다.
  if (loading) return null;

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center pt-28 text-center">
        <SearchIcon className="h-9 w-9 text-gray-300" />
        <p className="mt-4 text-base font-semibold text-gray-900">
          검색 결과가 없어요
        </p>
        <p className="mt-2 text-[13px] text-gray-400">
          다른 동네 이름으로 검색해보세요
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {results.map((match) => (
        <li key={match.id}>
          {/* 설계서는 "서울시 용산구 청파동"처럼 한 줄로 적고, 검색에 걸린 동 이름을 강조한다. */}
          <button
            type="button"
            onClick={() => onSelect(match)}
            className="flex w-full items-center py-3.5 text-left text-sm text-[#171B1C] active:bg-[#FFEFF6]"
          >
            <span>{match.district}</span>
            <span className="ml-1 font-semibold">{match.keyword}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}