//A103 검색 결과 리스트

import type { RegionMatch } from "../../data/region";

interface RegionResultProps {
  results: RegionMatch[];
  onSelect: (match: RegionMatch) => void;
}

export default function RegionResult({ results, onSelect }: RegionResultProps) {
  if (results.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-sm text-gray-400">
        검색 결과가 없어요
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {results.map((match) => (
        <li key={match.id}>
          <button
            type="button"
            onClick={() => onSelect(match)}
            className="flex w-full items-center justify-between py-3.5 text-left"
          >
            <span className="text-sm text-gray-900">{match.district}</span>
            <span className="text-xs text-gray-400">{match.keyword}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}