import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../../components/onboarding/SearchBar";
import RegionResult from "../../components/onboarding/RegionResult";
import RegionChips from "../../components/onboarding/RegionChips";
import type { SelectedRegion } from "../../components/onboarding/RegionChips";
import RegionMapPicker from "../../components/onboarding/RegionMapPicker";
import { CrosshairIcon } from "../../assets/icons";
import { getPresentRegion, type Region, type RegionMatch, searchRegions, shortenSido } from "../../data/region";

const MAX_REGIONS = 3;

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

type Coords = { latitude: number; longitude: number };
type PositionResult = { coords: Coords } | { error: string | null };

type SelectedRegionWithId = SelectedRegion & { regionId?: number };

interface RegionPageProps {
  onBack?: () => void;
  onNext?: (regions: SelectedRegionWithId[]) => void;
  onSkip?: () => void;
}

export default function RegionPage({ onBack, onNext, onSkip }: RegionPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [recenterToken, setRecenterToken] = useState(0);

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

  async function requestCurrentPosition(): Promise<PositionResult> {
    if (!("geolocation" in navigator)) {
      return { error: "이 브라우저에서는 현재 위치를 쓸 수 없어요" };
    }

    if (!window.isSecureContext) {
      return { error: "보안 연결(HTTPS)에서만 현재 위치를 쓸 수 있어요" };
    }

    setIsLocating(true);
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      return { coords: { latitude, longitude } };
    } catch (err) {
      console.error(err);

      if (
        err instanceof GeolocationPositionError &&
        err.code === err.PERMISSION_DENIED
      ) {
        return { error: null };
      }

      return { error: toLocationErrorMessage(err) };
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

  async function handleOpenCurrentLocation() {
    const result = await requestCurrentPosition();

    if ("error" in result) {
      setToast(result.error);
      return;
    }

    setCurrentRegion(null);
    setLocationError(null);
    setMapCenter(result.coords);
    setRecenterToken((n) => n + 1);
    setView("map");
    handleCenterChange(result.coords.latitude, result.coords.longitude);
  }

  async function handleRetryCurrentLocation() {
    const result = await requestCurrentPosition();

    if ("error" in result) {
      setLocationError(result.error);
      return;
    }

    setLocationError(null);
    setMapCenter(result.coords);
    setRecenterToken((n) => n + 1);
    handleCenterChange(result.coords.latitude, result.coords.longitude);
  }

  function handleConfirmCurrentLocation() {
    if (!currentRegion) return;
    addRegion({
      regionId: currentRegion.regionId,
      district: `${shortenSido(currentRegion.firstDepth)} ${currentRegion.secondDepth}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView("search");
  }

  function goNextStep(regionIds: number[]) {
    if (onNext) {
      onNext(selected);
      return;
    }

    navigate("/onboarding/profile", {
      state: {
        ...location.state,
        regionIds,
      },
    });
  }

  function handleSkip() {
    if (onSkip) {
      onSkip();
      return;
    }
    goNextStep([]);
  }

  if (view === "map") {
    const address = currentRegion
      ? `${shortenSido(currentRegion.firstDepth)} ${currentRegion.secondDepth} ${currentRegion.thirdDepth}`.trim()
      : "";

    return (
      <RegionMapPicker
        center={mapCenter}
        address={address}
        loading={isLocating}
        error={locationError}
        recenterToken={recenterToken}
        onCenterChange={handleCenterChange}
        onRetry={handleRetryCurrentLocation}
        onBack={() => setView("search")}
        onConfirm={handleConfirmCurrentLocation}
      />
    );
  }

  const canProceed = selected.length > 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] px-5">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-3.5 flex h-10 w-10 items-center justify-start"
          aria-label="뒤로가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#171B1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className="text-[13px] font-semibold text-[#000000]">
          서비스 시작하기
        </h2>
      </header>

      <main className="flex flex-1 flex-col px-[24px] pb-[29px] pt-[42px]">
        <section>
          <h1 className="text-[21px] font-semibold leading-[1.5] text-[#000000]">
            네일아트를 탐색할
            <br />
            관심 지역을 선택해주세요
          </h1>

          <p className="mt-[7px] text-[13px] font-medium leading-[1.5] text-[#646F7C]">
            최대 {MAX_REGIONS}개까지 추가할 수 있어요
          </p>

          <div className="mt-[42px]">
            <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />
          </div>

          <button
            type="button"
            onClick={handleOpenCurrentLocation}
            disabled={isLocating}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-500 disabled:opacity-60"
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
        </section>

        <div className="flex-1 min-h-[30px]" />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[13px] text-[#ADB0B5]"
          >
            건너뛰기
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => {
              const regionIds = selected
                .map((r) => r.regionId)
                .filter((id): id is number => id != null);

              goNextStep(regionIds);
            }}
            className={`h-[52px] w-full rounded-[10px] text-[15px]
              font-medium text-white transition-colors
              ${canProceed ? 'bg-[#F70071]' : 'cursor-not-allowed bg-[#FFC0DC]'}
            `}
          >
            다음
          </button>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}