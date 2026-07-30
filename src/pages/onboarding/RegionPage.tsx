import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/onboarding/SearchBar";
import RegionResult from "../../components/onboarding/RegionResult";
import RegionChips from "../../components/onboarding/RegionChips";
import type { SelectedRegion } from "../../components/onboarding/RegionChips";
import RegionMapPicker from "../../components/onboarding/RegionMapPicker";
import { ChevronLeftIcon, CrosshairIcon } from "../../assets/icons";
import { getPresentRegion, type Region, type RegionMatch, searchRegions, shortenSido } from "../../data/region";

const MAX_REGIONS = 3;

interface RegionInfo {
  regionId: number;
  firstDepth: string;
  secondDepth: string;
  thirdDepth: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 좌표를 법정동으로 바꿔주는 API. 지역 검색(searchRegions)과 달리 결과가 한 건이다.
async function fetchPresentRegion(
  latitude: number,
  longitude: number
): Promise<RegionInfo> {
  const token = localStorage.getItem("tempToken");
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/regions/present?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: token
        ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
        : {},
    }
  );
  if (!res.ok) {
    throw new Error(`현재 위치 지역 조회 실패: ${res.status}`);
  }
  const data: ApiResponse<RegionInfo> = await res.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
}

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

type SelectedRegionWithId = SelectedRegion & { regionId?: number };

interface RegionPageProps {
  onBack?: () => void;
  onNext?: (regions: SelectedRegionWithId[]) => void;
  onSkip?: () => void;
}

export default function RegionPage({ onBack, onNext, onSkip }: RegionPageProps) {
  const navigate = useNavigate();
  const location = useLocation(); // 🔑 이전 단계(DesignPage)에서 넘어온 state를 받기 위해 사용

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

  async function loadCurrentLocation() {
    setIsLocating(true);
    setLocationError(null);
    setCurrentRegion(null);

    if (!("geolocation" in navigator)) {
      setLocationError("이 브라우저에서는 현재 위치를 쓸 수 없어요.");
      setIsLocating(false);
      return;
    }

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
    addRegion({
      regionId: currentRegion.regionId,
      district: `${currentRegion.firstDepth} ${currentRegion.secondDepth}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView("search");
  }

  // 🔑 다음 단계로 이동하는 공통 함수
  function goNextStep(regionIds: number[]) {
    // 1. props로 핸들러가 넘겨졌다면 우선 실행
    if (onNext) {
      onNext(selected);
      return;
    }

    // 2. 라우터를 사용하는 경우 다음 온보딩 단계(닉네임/프로필 입력 화면 등)로 이동
    navigate("/onboarding/profile", {
      state: {
        ...location.state, // 이전 단계의 designTagIds 보존
        regionIds,         // 현재 선택한 regionId 배열 (예: [210])
      },
    });
  }

  // 🔑 건너뛰기 처리 함수
  function handleSkip() {
    if (onSkip) {
      onSkip();
      return;
    }
    goNextStep([]); // 빈 배열 전달
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
          onClick={handleSkip}
          className="mb-3 w-full text-center text-sm text-gray-400"
        >
          건너뛰기
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            // 선택된 항목들의 regionId 숫자를 모아 배열로 추출 (예: [210])
            const regionIds = selected
              .map((r) => r.regionId)
              .filter((id): id is number => id != null);

            goNextStep(regionIds);
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