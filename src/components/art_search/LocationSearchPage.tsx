// 아트 찾기 필터 - 위치 검색 화면
//
// 관심 지역 재설정(F104)과 화면 구성·동작이 같아서 같은 컴포넌트를 그대로 쓴다.
// 다른 점은 이 화면이 필터 시트 위에 겹쳐 뜨는 오버레이라는 것과,
// 저장 대신 [선택 완료]로 고른 지역을 필터에 돌려준다는 것이다.

import { useEffect, useRef, useState } from 'react';
import SearchBar from '../onboarding/SearchBar';
import RegionResult from '../onboarding/RegionResult';
import RegionChips, { type SelectedRegion } from '../onboarding/RegionChips';
import RegionMapPicker from '../onboarding/RegionMapPicker';
import { ChevronLeftIcon, CrosshairIcon } from '../../assets/icons';
import {
  searchRegions,
  getPresentRegion,
  shortenSido,
  spaceSigungu,
  type Region,
  type RegionMatch,
} from '../../data/region';

// 관심 지역 설정(A103/F104)과 같은 규칙으로 위치도 최대 3개까지만 담는다.
const MAX_REGIONS = 3;

// 필터는 regionId로 아트를 조회하기 때문에, 현재 위치로 추가한 지역도 regionId를 들고 있어야 한다.
// (예전에는 주소 문자열만 담아서 필터에 엉뚱한 id가 넘어갔다)
type SelectedRegionWithId = SelectedRegion & { regionId?: number };

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
      return '위치 권한이 거부됐어요. 브라우저 설정에서 허용해주세요.';
    }
    if (err.code === err.TIMEOUT) {
      return '위치 확인이 오래 걸려요. 다시 시도해주세요.';
    }
    return '현재 위치를 확인할 수 없어요.';
  }
  return '현재 위치를 불러오지 못했어요.';
}

type Coords = { latitude: number; longitude: number };
// error가 null이면 아무 안내 없이 원래 화면에 그대로 머문다는 뜻이다. (권한 거부가 여기 해당)
type PositionResult = { coords: Coords } | { error: string | null };

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
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<SelectedRegionWithId[]>(initialSelected);
  const [toast, setToast] = useState<string | null>(null);

  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [mapCenter, setMapCenter] = useState<Coords | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  // 위치를 다시 잡을 때마다 올려서 지도를 그 좌표로 되돌린다.
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

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function addRegion(region: {
    regionId?: number;
    district?: string;
    keyword?: string;
  }) {
    const isDuplicate = selected.some(
      (r) =>
        (region.regionId != null && r.regionId === region.regionId) ||
        (region.district &&
          r.district === region.district &&
          r.keyword === region.keyword),
    );
    if (isDuplicate) return;

    if (selected.length >= MAX_REGIONS) {
      setToast(`최대 ${MAX_REGIONS}개까지 추가할 수 있어요`);
      return;
    }

    setSelected((prev) => [
      ...prev,
      {
        id:
          region.regionId != null ? String(region.regionId) : crypto.randomUUID(),
        regionId: region.regionId,
        district: region.district,
        keyword: region.keyword,
      },
    ]);
  }

  function handleSelectResult(match: RegionMatch) {
    addRegion({
      regionId: Number(match.id),
      district: match.district,
      keyword: match.keyword,
    });
    setQuery('');
  }

  function handleRemoveRegion(id: string) {
    setSelected((prev) => prev.filter((r) => r.id !== id));
  }

  // 좌표를 받아오는 데까지만 책임진다. 주소 조회와 화면 전환은 호출한 쪽에서 결정한다.
  // 실패 메시지를 토스트로 띄울지 지도 하단에 띄울지가 상황마다 달라서 반환값으로 넘긴다.
  async function requestCurrentPosition(): Promise<PositionResult> {
    if (!('geolocation' in navigator)) {
      return { error: '이 브라우저에서는 현재 위치를 쓸 수 없어요' };
    }
    // 위치 API는 HTTPS(또는 localhost)에서만 동작한다.
    if (!window.isSecureContext) {
      return { error: '보안 연결(HTTPS)에서만 현재 위치를 쓸 수 있어요' };
    }

    setIsLocating(true);
    try {
      // 여기서 브라우저 위치 권한 팝업이 뜬다. 사용자가 답할 때까지 멈춰 있는다.
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      return { coords: { latitude, longitude } };
    } catch (err) {
      console.error(err);

      // 허용하지 않은 경우는 안내 없이 원래 화면에 머문다.
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
      setLocationError('이 위치의 지역 정보를 찾지 못했어요.');
    } finally {
      if (requestId === centerRequestId.current) setIsLocating(false);
    }
  }

  // 팝업 → 허용 → 지도 순서. 허용 전에는 위치 검색 화면에 그대로 머문다.
  async function handleOpenCurrentLocation() {
    const result = await requestCurrentPosition();

    if ('error' in result) {
      setToast(result.error);
      return;
    }

    setCurrentRegion(null);
    setLocationError(null);
    setMapCenter(result.coords);
    setRecenterToken((n) => n + 1);
    setView('map');
    handleCenterChange(result.coords.latitude, result.coords.longitude);
  }

  // 지도 화면의 [다시 시도]. 지도에서는 토스트 대신 하단 시트에 에러를 남긴다.
  async function handleRetryCurrentLocation() {
    const result = await requestCurrentPosition();

    if ('error' in result) {
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
      district: `${shortenSido(currentRegion.firstDepth)} ${spaceSigungu(currentRegion.secondDepth)}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView('search');
  }

  // 지도에서 [이 위치로 추가]를 눌러 한도에 걸린 경우에도 보여야 해서 두 화면에 모두 건다.
  const toastNode = toast ? (
    <div className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
      {toast}
    </div>
  ) : null;

  if (view === 'map') {
    // 하단 시트도 설계서 표기대로 "시+구+동"으로 줄여 보여준다.
    const address = currentRegion
      ? `${shortenSido(currentRegion.firstDepth)} ${spaceSigungu(currentRegion.secondDepth)} ${currentRegion.thirdDepth}`.trim()
      : '';

    return (
      <div className="fixed inset-0 z-50 bg-white">
        <RegionMapPicker
          center={mapCenter}
          address={address}
          loading={isLocating}
          error={locationError}
          recenterToken={recenterToken}
          onCenterChange={handleCenterChange}
          onRetry={handleRetryCurrentLocation}
          onBack={() => setView('search')}
          onConfirm={handleConfirmCurrentLocation}
        />

        {toastNode}
      </div>
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
          onClick={handleOpenCurrentLocation}
          disabled={isLocating}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          <CrosshairIcon className="h-4 w-4 text-gray-500" />
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

      {toastNode}
    </div>
  );
}
