// [F104] 내 정보 관리 - 관심 지역 재설정 화면

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CrosshairIcon } from '../../assets/icons';
import SearchBar from '../../components/onboarding/SearchBar';
import RegionResult from '../../components/onboarding/RegionResult';
import RegionChips from '../../components/onboarding/RegionChips';
import type { SelectedRegion } from '../../components/onboarding/RegionChips';
import RegionMapPicker from '../../components/onboarding/RegionMapPicker';
import { MOCK_CURRENT_LOCATION } from '../../data/mockupdata/regionData';
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

  const [view, setView] = useState<'search' | 'map'>('search');
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

  function addRegion(region: {
    regionId?: number;
    district?: string;
    keyword?: string;
    label?: string;
  }) {
    const isDuplicate = selectedRegions.some(
      (r) =>
        (region.regionId != null && r.regionId === region.regionId) ||
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
        id: region.regionId != null ? String(region.regionId) : crypto.randomUUID(),
        regionId: region.regionId,
        district: region.district,
        keyword: region.keyword,
        label: region.label,
      },
    ]);
  }

  function handleSelectResult(match: RegionMatch) {
    addRegion({ regionId: Number(match.id), district: match.district, keyword: match.keyword });
    setQuery('');
  }

  function handleRemoveRegion(id: string) {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  }

  function handleConfirmCurrentLocation() {
    addRegion({ label: MOCK_CURRENT_LOCATION.shortDistrict });
    setView('search');
  }

  const canSave = selectedRegions.length > 0;

  function handleSave() {
    if (!canSave) return;
    // TODO: 백엔드에 관심 지역 재설정 요청
    navigate('/mypage');
  }

  if (view === 'map') {
    return (
      // TODO: 온보딩(RegionPage)처럼 위치 권한 → GET /regions/present 로 교체하고
      // center에 실제 좌표를 넘겨야 지도가 표시된다. 지금은 목업 주소만 노출된다.
      <RegionMapPicker
        center={null}
        address={MOCK_CURRENT_LOCATION.fullAddress}
        onBack={() => setView('search')}
        onConfirm={handleConfirmCurrentLocation}
      />
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100 px-4">
        <button
          type="button"
          onClick={() => navigate('/mypage')}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">관심 지역 재설정</h1>
      </header>

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-xl font-bold leading-snug text-gray-900">
          네일아트를 탐색할
          <br />
          관심 지역을 선택해주세요
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          최대 {MAX_REGIONS}개까지 추가할 수 있어요
        </p>

        <div className="mt-6">
          <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
        </div>

        <button
          type="button"
          onClick={() => setView('map')}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-500"
        >
          <CrosshairIcon className="h-4 w-4" />
          현재 위치로 추가
        </button>

        <div className="mt-4">
          {query.trim().length > 0 ? (
            <RegionResult results={results} onSelect={handleSelectResult} />
          ) : (
            <RegionChips regions={selectedRegions} onRemove={handleRemoveRegion} />
          )}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            canSave ? 'bg-[#F70071]' : 'bg-[#FFC0DC]'
          }`}
        >
          저장
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
