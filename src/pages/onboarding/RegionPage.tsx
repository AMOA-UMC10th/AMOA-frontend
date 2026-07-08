//관심 지역 설정 페이지 A103
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/onboarding/SearchBar";
import RegionResult from "../../components/onboarding/RegionResult";
import RegionChips from "../../components/onboarding/RegionChips";
import type { SelectedRegion } from "../../components/onboarding/RegionChips";
import RegionMapPicker from "../../components/onboarding/RegionMapPicker";
import { ChevronLeftIcon, CrosshairIcon } from "../../components/onboarding/icons";
import {
  MOCK_CURRENT_LOCATION,
  searchRegions,
  type RegionMatch,
} from "../../components/onboarding/regionData";

const MAX_REGIONS = 3;

interface RegionPageProps {
  onBack?: () => void;
  onNext?: (regions: SelectedRegion[]) => void;
  onSkip?: () => void;
}

export default function RegionPage({ onBack, onNext, onSkip }: RegionPageProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<"search" | "map">("search");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SelectedRegion[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // TODO: 백엔드에 지역 검색 요청 (현재는 목업 데이터로 검색)
  const results = searchRegions(query);

  function addRegion(label: string) {
    if (selected.some((r) => r.label === label)) return;
    if (selected.length >= MAX_REGIONS) {
      setToast(`최대 ${MAX_REGIONS}개까지 추가할 수 있어요`);
      return;
    }
    setSelected((prev) => [...prev, { id: crypto.randomUUID(), label }]);
  }

  function handleSelectResult(match: RegionMatch) {
    addRegion(match.shortDistrict);
    setQuery("");
  }

  function handleRemoveRegion(id: string) {
    setSelected((prev) => prev.filter((r) => r.id !== id));
  }

  function handleConfirmCurrentLocation() {
    // TODO: 백엔드에 현재 위치 기반 지역(GPS 좌표 → 행정구역) 조회 요청
    addRegion(MOCK_CURRENT_LOCATION.shortDistrict);
    setView("search");
  }

  if (view === "map") {
    return (
      <RegionMapPicker
        address={MOCK_CURRENT_LOCATION.fullAddress}
        onBack={() => setView("search")}
        onConfirm={handleConfirmCurrentLocation}
      />
    );
  }

  const canProceed = selected.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">서비스 시작하기</h1>
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
          <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />
        </div>

        <button
          type="button"
          onClick={() => setView("map")}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-500"
        >
          <CrosshairIcon className="h-4 w-4" />
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

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={onSkip}
          className="mb-3 w-full text-center text-sm text-gray-400"
        >
          건너뛰기
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            // TODO: 백엔드에 관심 지역 저장 및 온보딩 완료 요청
            onNext?.(selected);
          }}
          className={`w-full rounded-2xl py-4 text-sm font-semibold ${
            canProceed
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-300"
          }`}
        >
          다음
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
