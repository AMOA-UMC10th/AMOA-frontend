import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/onboarding/SearchBar";
import RegionResult from "../../components/onboarding/RegionResult";
import RegionChips from "../../components/onboarding/RegionChips";
import type { SelectedRegion } from "../../components/onboarding/RegionChips";
import RegionMapPicker from "../../components/onboarding/RegionMapPicker";
import { ChevronLeftIcon, CrosshairIcon } from "../../assets/icons";
import {
  searchRegions,
  getPresentRegion,
  shortenSido,
  type Region,
  type RegionMatch,
} from "../../data/region";

const MAX_REGIONS = 3;

// 브라우저 위치 권한은 콜백 기반이라 await로 쓰기 위해 감싼다.
function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

function toLocationErrorMessage(err: unknown): string {
  if (err instanceof GeolocationPositionError) {
    if (err.code === err.PERMISSION_DENIED) {
      return "위치 권한이 거부됐어요. 브라우저 설정에서 허용해주세요.";
    }
    if (err.code === err.TIMEOUT) {
      return "위치 확인이 오래 걸려요. 다시 시도해주세요.";
    }
    return "현재 위치를 확인할 수 없어요.";
  }
  return "현재 위치를 불러오지 못했어요.";
}

// 온보딩 저장에는 지역 ID가 필요한데 RegionChips의 SelectedRegion에는 없어서,
// 이 화면 안에서만 regionId를 덧붙여 들고 다닌다.
type SelectedRegionWithId = SelectedRegion & { regionId?: number };

interface RegionPageProps {
  onBack?: () => void;
  onNext?: (regions: SelectedRegionWithId[]) => void;
  onSkip?: () => void;
}

export default function RegionPage({ onBack, onNext, onSkip }: RegionPageProps) {
  const navigate = useNavigate();

  // 온보딩 이전 단계는 항상 디자인 선택이라 경로를 고정한다.
  // navigate(-1)을 쓰면, 닉네임 화면의 뒤로가기가 이 화면을 새로 push 하는 탓에
  // 지역 ↔ 닉네임을 오가는 왕복이 생긴다. replace로 넣어 기록이 쌓이지 않게 한다.
  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/onboarding/design", { replace: true });
  }
  const [view, setView] = useState<"search" | "map">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RegionMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<SelectedRegionWithId[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // 입력하는 즉시 검색 중으로 두고, 응답이 온 뒤에 결과를 그린다.
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

    // 검색어가 바뀌면 이전 요청의 응답은 버린다.
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function addRegion(region: {
    regionId?: number;
    district?: string;
    keyword?: string;
    label?: string;
  }) {
    const isDuplicate = selected.some(
      (r) =>
        (region.regionId != null && r.regionId === region.regionId) ||
        (region.district && r.district === region.district && r.keyword === region.keyword) ||
        (region.label && r.label === region.label)
    );
    if (isDuplicate) return;

    if (selected.length >= MAX_REGIONS) {
      setToast(`최대 ${MAX_REGIONS}개까지 추가할 수 있어요`);
      return;
    }

    setSelected((prev) => [
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

  // 온보딩 저장에는 regionId가 필요해서 검색 결과의 id를 함께 담아둔다.
  function handleSelectResult(match: RegionMatch) {
    addRegion({
      regionId: Number(match.id),
      district: match.district,
      keyword: match.keyword,
    });
    setQuery("");
  }

  function handleRemoveRegion(id: string) {
    setSelected((prev) => prev.filter((r) => r.id !== id));
  }

  // 지도 화면으로 넘어가면서 위치 권한 → 좌표 → 지역 조회를 순서대로 진행한다.
  async function loadCurrentLocation() {
    setIsLocating(true);
    setLocationError(null);
    setCurrentRegion(null);

    if (!("geolocation" in navigator)) {
      setLocationError("이 브라우저에서는 현재 위치를 쓸 수 없어요.");
      setIsLocating(false);
      return;
    }
    // 위치 API는 HTTPS(또는 localhost)에서만 동작한다.
    if (!window.isSecureContext) {
      setLocationError("보안 연결(HTTPS)에서만 현재 위치를 쓸 수 있어요.");
      setIsLocating(false);
      return;
    }

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setMapCenter({ latitude, longitude });
      const region = await getPresentRegion(latitude, longitude);
      setCurrentRegion(region);
    } catch (err) {
      console.error(err);
      setLocationError(toLocationErrorMessage(err));
    } finally {
      setIsLocating(false);
    }
  }

  // 지도를 드래그하면 중앙 핀 좌표로 주소를 다시 조회한다.
  // 드래그가 연달아 일어나면 마지막 요청 결과만 반영한다.
  const centerRequestId = useRef(0);

  async function handleCenterChange(latitude: number, longitude: number) {
    const requestId = ++centerRequestId.current;
    setIsLocating(true);
    setLocationError(null);

    try {
      const region = await getPresentRegion(latitude, longitude);
      if (requestId !== centerRequestId.current) return;
      setCurrentRegion(region);
    } catch (err) {
      if (requestId !== centerRequestId.current) return;
      console.error(err);
      setCurrentRegion(null);
      setLocationError("이 위치의 지역 정보를 찾지 못했어요.");
    } finally {
      if (requestId === centerRequestId.current) setIsLocating(false);
    }
  }

  function handleOpenCurrentLocation() {
    setView("map");
    loadCurrentLocation();
  }

  function handleConfirmCurrentLocation() {
    if (!currentRegion) return;
    // 검색 결과로 담을 때와 같은 모양으로 넣어야 중복 판정과 칩 표기가 맞는다.
    addRegion({
      regionId: currentRegion.regionId,
      district: `${currentRegion.firstDepth} ${currentRegion.secondDepth}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView("search");
  }

  if (view === "map") {
    // 하단 시트도 설계서 표기대로 "시+구+동"으로 줄여 보여준다.
    const address = currentRegion
      ? `${shortenSido(currentRegion.firstDepth)} ${currentRegion.secondDepth} ${currentRegion.thirdDepth}`.trim()
      : "";

    return (
      <RegionMapPicker
        center={mapCenter}
        address={address}
        loading={isLocating}
        error={locationError}
        onCenterChange={handleCenterChange}
        onRetry={loadCurrentLocation}
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
          onClick={handleBack}
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
          onClick={handleOpenCurrentLocation}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-500"
        >
          <CrosshairIcon className="h-4 w-4" />
          현재 위치로 추가
        </button>

        <div className="mt-4">
          {query.trim().length > 0 ? (
            <RegionResult
              results={results}
              loading={isSearching}
              onSelect={handleSelectResult}
            />
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
            onNext?.(selected);
          }}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            canProceed ? "bg-[#F70071]" : "bg-[#FFC0DC]"
          }`}
        >
          다음
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}