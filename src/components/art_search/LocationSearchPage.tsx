import React, { useEffect, useState } from 'react';
import SearchBar from '../onboarding/SearchBar';
import RegionResult from '../onboarding/RegionResult';
import RegionChips, { type SelectedRegion } from '../onboarding/RegionChips';
import RegionMapPicker from '../onboarding/RegionMapPicker';
import { ChevronLeftIcon, CrosshairIcon } from '../../assets/icons';
import { MOCK_CURRENT_LOCATION } from '../../data/mockupdata/regionData';
import { searchRegions, type RegionMatch } from '../../data/region';

interface LocationSearchPageProps {
  initialSelected?: SelectedRegion[];
  onClose: () => void;
  onApply: (selected: SelectedRegion[]) => void;
}

export default function LocationSearchPage({
  initialSelected = [],
  onClose,
  onApply,
}: LocationSearchPageProps) {
  const [view, setView] = useState<'search' | 'map'>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegionMatch[]>([]);
  const [selected, setSelected] = useState<SelectedRegion[]>(initialSelected);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchRegions(query)
        .then(setResults)
        .catch((err) => {
          console.error('지역 검색 실패:', err);
          setResults([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function addRegion(region: { id?: string; district?: string; keyword?: string; label?: string }) {
    const isDuplicate = selected.some(
      (r) =>
        (region.id && r.id === region.id) ||
        (region.district && r.district === region.district && r.keyword === region.keyword) ||
        (region.label && r.label === region.label)
    );

    if (isDuplicate) return;

    setSelected((prev) => [
      ...prev,
      {
        id: region.id || crypto.randomUUID(),
        district: region.district,
        keyword: region.keyword,
        label: region.label,
      },
    ]);
  }

  function handleSelectResult(match: RegionMatch) {
    addRegion({
      id: match.id,
      district: match.district,
      keyword: match.keyword,
    });
    setQuery('');
  }

  function handleRemoveRegion(id: string) {
    setSelected((prev) => prev.filter((r) => r.id !== id));
  }

  function handleConfirmCurrentLocation() {
    addRegion({ label: MOCK_CURRENT_LOCATION.shortDistrict });
    setView('search');
  }

  if (view === 'map') {
    return (
      <RegionMapPicker
        center={{
        latitude: MOCK_CURRENT_LOCATION.latitude || 37.5446,
        longitude: MOCK_CURRENT_LOCATION.longitude || 127.0557,
      }}
      address={MOCK_CURRENT_LOCATION.fullAddress}
      onBack={() => setView('search')}
      onConfirm={handleConfirmCurrentLocation}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100 px-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">위치 검색</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="구/동으로 검색"
        />

        <button
          type="button"
          onClick={() => setView('map')}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <CrosshairIcon className="h-4 w-4 text-gray-500" />
          현재 위치로 추가
        </button>

        <div className="mt-4">
          {query.trim().length > 0 ? (
            <RegionResult results={results} onSelect={handleSelectResult} />
          ) : (
            <RegionChips regions={selected} onRemove={handleRemoveRegion} />
          )}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            onApply(selected);
            onClose();
          }}
          className="w-full rounded-2xl bg-[#F70071] py-4 text-sm font-semibold text-white transition-all active:scale-[0.99]"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}