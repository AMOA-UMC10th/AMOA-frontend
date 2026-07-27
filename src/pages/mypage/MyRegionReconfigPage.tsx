// [F104] 내 정보 관리 - 관심 지역 재설정 화면

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import SearchBar from '../../components/onboarding/SearchBar';
import RegionResult from '../../components/onboarding/RegionResult';
import RegionChips from '../../components/onboarding/RegionChips';
import type { SelectedRegion } from '../../components/onboarding/RegionChips';
import { searchRegions, type RegionMatch } from '../../data/region';
import { mockSettingData } from '../../data/mockupdata/userData';

const MAX_REGIONS = 3;

// 목업 응답의 지역 표기("서울특별시 강남구")를 온보딩 컴포넌트가 쓰는 구 단위 표기("강남구")로 변환
function toShortDistrict(fullLabel: string): string {
  return fullLabel.trim().split(' ').pop() ?? fullLabel;
}

export default function MyRegionReconfigPage() {
  const navigate = useNavigate();
  const setting = mockSettingData.result;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegionMatch[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>(() =>
    setting.interestedRegions
      .map(toShortDistrict)
      .map((label) => ({ id: crypto.randomUUID(), label })),
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchRegions(query)
        .then(setResults)
        .catch((err) => {
          console.error(err);
          setResults([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function addRegion(region: { district?: string; keyword?: string; label?: string }) {
    const isDuplicate = selectedRegions.some(
      (r) =>
        (region.district && r.district === region.district && r.keyword === region.keyword) ||
        (region.label && r.label === region.label),
    );
    if (isDuplicate) return;

    if (selectedRegions.length >= MAX_REGIONS) {
      setToast(`최대 ${MAX_REGIONS}개까지 추가할 수 있어요`);
      return;
    }
    setSelectedRegions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        district: region.district,
        keyword: region.keyword,
        label: region.label,
      },
    ]);
  }

  function handleSelectResult(match: RegionMatch) {
    addRegion({ district: match.district, keyword: match.keyword });
    setQuery('');
  }

  function handleRemoveRegion(id: string) {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  }

  const canSave = selectedRegions.length > 0;

  function handleSave() {
    if (!canSave) return;
    // TODO: 백엔드에 관심 지역 재설정 요청
    setToast('관심 지역이 저장되었어요');
  }

  return (
    <main className="min-h-dvh bg-white pb-16">
      <header className="relative flex h-[72px] items-center justify-center border-b border-[#E9EBEE] px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">관심 지역 재설정</h1>
      </header>

      <div className="flex flex-col gap-3 px-5 py-8">
        <div>
          <h2 className="text-sm font-bold text-[#171B1C]">관심 지역</h2>
          <p className="mt-1 text-xs text-[#ADB0B5]">최대 {MAX_REGIONS}개까지 추가할 수 있어요</p>
        </div>

        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />

        {query.trim().length > 0 ? (
          <RegionResult results={results} onSelect={handleSelectResult} />
        ) : (
          <RegionChips regions={selectedRegions} onRemove={handleRemoveRegion} />
        )}

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="mt-5 h-[52px] w-full rounded-[10px] bg-[#F70071] text-[15px] font-medium text-white disabled:bg-[#FFC0DC]"
        >
          저장
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
