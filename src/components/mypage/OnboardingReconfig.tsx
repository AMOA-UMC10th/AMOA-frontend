// [F104] 관심 지역/디자인 무드 재설정 컴포넌트 (최대 3개 지역 검색 및 다중 무드 선택)

import { useEffect, useState } from 'react';
import SearchBar from '../onboarding/SearchBar';
import RegionResult from '../onboarding/RegionResult';
import RegionChips from '../onboarding/RegionChips';
import type { SelectedRegion } from '../onboarding/RegionChips';
import MoodCard from '../onboarding/MoodCard';
import { searchRegions, type RegionMatch } from '../../data/region';

export const MOODS = ['심플', '아기자기', '화려', '스트릿', '유니크', '내추럴', '모던'];

const MAX_REGIONS = 3;

export interface OnboardingReconfigValue {
  regions: string[];
  moods: string[];
}

interface OnboardingReconfigProps {
  initialRegions: string[];
  initialMoods: string[];
  onSave: (value: OnboardingReconfigValue) => void;
}

export default function OnboardingReconfig({
  initialRegions,
  initialMoods,
  onSave,
}: OnboardingReconfigProps) {
  const [query, setQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>(() =>
    initialRegions.map((label) => ({ id: crypto.randomUUID(), label })),
  );
  const [selectedMoods, setSelectedMoods] = useState<string[]>(initialMoods);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const [results, setResults] = useState<RegionMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 지역 검색은 실제 API를 쓴다. 입력할 때마다 부르지 않도록 300ms 늦춰서 호출한다.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(() => {
      searchRegions(query)
        .then((matches) => {
          if (!cancelled) setResults(matches);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error(err);
          setResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function addRegion(label: string) {
    if (selectedRegions.some((r) => r.label === label)) return;
    if (selectedRegions.length >= MAX_REGIONS) {
      setToast(`최대 ${MAX_REGIONS}개까지 추가할 수 있어요`);
      return;
    }
    setSelectedRegions((prev) => [...prev, { id: crypto.randomUUID(), label }]);
  }

  function handleSelectResult(match: RegionMatch) {
    // API는 "서울특별시 강남구" + "역삼동"으로 내려주는데, 칩에는 "강남구 역삼동"으로 담는다.
    const gu = match.district.split(' ').pop() ?? match.district;
    addRegion(`${gu} ${match.keyword}`.trim());
    setQuery('');
  }

  function handleRemoveRegion(id: string) {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleMood(mood: string) {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  }

  const canSave = selectedRegions.length > 0 && selectedMoods.length > 0;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      // RegionChips의 label이 선택 항목으로 바뀌어서 빈 값은 걸러낸다.
      regions: selectedRegions
        .map((r) => r.label)
        .filter((label): label is string => Boolean(label)),
      moods: selectedMoods,
    });
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#171B1C]">관심 지역</h3>
          <p className="mt-1 text-xs text-[#ADB0B5]">최대 {MAX_REGIONS}개까지 추가할 수 있어요</p>
        </div>

        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />

        {query.trim().length > 0 ? (
          <RegionResult
            results={results}
            loading={isSearching}
            onSelect={handleSelectResult}
          />
        ) : (
          <RegionChips regions={selectedRegions} onRemove={handleRemoveRegion} />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#171B1C]">디자인 무드</h3>
          <p className="mt-1 text-xs text-[#ADB0B5]">여러 개 선택할 수 있어요</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((mood) => (
            <MoodCard
              key={mood}
              label={mood}
              selected={selectedMoods.includes(mood)}
              onClick={() => toggleMood(mood)}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!canSave}
        onClick={handleSubmit}
        className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white disabled:bg-[#E9EBEE] disabled:text-[#ADB0B5]"
      >
        관심 지역/무드 저장
      </button>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
