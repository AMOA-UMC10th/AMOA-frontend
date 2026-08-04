// [F104] 내 정보 관리 - 관심 지역 재설정 화면
//
// 온보딩 A103과 화면 구성이 같아서 components/onboarding의 컴포넌트를 그대로 쓴다.
// 다른 점은 "이미 등록한 지역을 고치는" 화면이라는 것이다.
// - 진입 시 기존 관심 지역이 칩으로 미리 노출된다
// - 건너뛰기가 없고 하단 CTA가 [저장]이며, 바뀐 게 없으면 비활성이다
// - 검색창 안내 문구가 온보딩과 다르다 ("동, 지하철역 이름으로 검색")

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, CrosshairIcon } from '../../assets/icons';
import SearchBar from '../../components/onboarding/SearchBar';
import RegionResult from '../../components/onboarding/RegionResult';
import RegionChips from '../../components/onboarding/RegionChips';
import type { SelectedRegion } from '../../components/onboarding/RegionChips';
import RegionMapPicker from '../../components/onboarding/RegionMapPicker';
import {
  searchRegions,
  getPresentRegion,
  shortenSido,
  type Region,
  type RegionMatch,
} from '../../data/region';
import {
  getMyProfile,
  updateMyProfile,
  type InterestedRegion,
  type UserProfile,
} from '../../data/userdata/user';

const MAX_REGIONS = 3;

// 저장에는 regionId가 필요한데 RegionChips의 SelectedRegion에는 없어서,
// 이 화면 안에서만 regionId를 덧붙여 들고 다닌다. (온보딩 RegionPage와 같은 방식)
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

// 내 프로필은 지역 이름을 regionNDepthName으로 내려준다. 칩은 "구 동"만 보여주므로
// 검색 결과와 같은 모양(district/keyword)으로 맞춰 담는다.
function toSelectedRegion(region: InterestedRegion): SelectedRegionWithId {
  return {
    id: String(region.regionId),
    regionId: region.regionId,
    district: `${shortenSido(region.region1DepthName)} ${region.region2DepthName}`.trim(),
    keyword: region.region3DepthName,
  };
}

// 진입 시점과 지금 고른 값이 같은지 비교하려고 정렬해 문자열로 만든다. (순서는 무시)
function toIdKey(ids: number[]): string {
  return [...ids].sort((a, b) => a - b).join(',');
}

function selectedIds(regions: SelectedRegionWithId[]): number[] {
  return regions
    .map((r) => r.regionId)
    .filter((id): id is number => id != null);
}

export default function MyRegionReconfigPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selected, setSelected] = useState<SelectedRegionWithId[]>([]);
  // 바뀐 게 없으면 [저장]을 비활성으로 두기 위해 진입 시점의 값을 들고 있는다.
  const [initialKey, setInitialKey] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [view, setView] = useState<'search' | 'map'>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RegionMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [mapCenter, setMapCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  // 위치를 다시 잡을 때마다 올려서 지도를 그 좌표로 되돌린다.
  const [recenterToken, setRecenterToken] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 진입 시 기존 관심 지역을 칩으로 미리 채운다.
  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then((myProfile) => {
        if (cancelled) return;
        const regions = myProfile.interestedRegions.map(toSelectedRegion);
        setProfile(myProfile);
        setSelected(regions);
        setInitialKey(toIdKey(selectedIds(regions)));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error(err);
        setLoadError('관심 지역 정보를 불러오지 못했어요.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  // 지도 화면으로 넘어가면서 위치 권한 → 좌표 → 지역 조회를 순서대로 진행한다.
  async function loadCurrentLocation() {
    setIsLocating(true);
    setLocationError(null);
    setCurrentRegion(null);

    if (!('geolocation' in navigator)) {
      setLocationError('이 브라우저에서는 현재 위치를 쓸 수 없어요.');
      setIsLocating(false);
      return;
    }
    // 위치 API는 HTTPS(또는 localhost)에서만 동작한다.
    if (!window.isSecureContext) {
      setLocationError('보안 연결(HTTPS)에서만 현재 위치를 쓸 수 있어요.');
      setIsLocating(false);
      return;
    }

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setMapCenter({ latitude, longitude });
      setRecenterToken((n) => n + 1);
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
      setLocationError('이 위치의 지역 정보를 찾지 못했어요.');
    } finally {
      if (requestId === centerRequestId.current) setIsLocating(false);
    }
  }

  function handleOpenCurrentLocation() {
    setView('map');
    loadCurrentLocation();
  }

  function handleConfirmCurrentLocation() {
    if (!currentRegion) return;
    addRegion({
      regionId: currentRegion.regionId,
      district: `${shortenSido(currentRegion.firstDepth)} ${currentRegion.secondDepth}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView('search');
  }

  // 바꾼 게 있어야 저장할 수 있다. (선호 디자인 재설정과 동일한 규칙)
  const isDirty = toIdKey(selectedIds(selected)) !== initialKey;
  const canSave =
    isDirty && selected.length > 0 && !isSaving && !isLoading && !loadError;

  // PATCH는 관심지역과 디자인태그를 둘 다 필수로 받고, 빈 배열을 보내면 전체 삭제된다.
  // 이 화면에서 건드리지 않는 디자인태그는 조회해온 값을 그대로 되돌려보내 유지시킨다.
  async function handleSave() {
    if (!canSave || !profile) return;

    setIsSaving(true);
    try {
      await updateMyProfile({
        selectedDesignTagIds: profile.selectedDesignTagIds,
        interestedRegionIds: selected
          .map((r) => r.regionId)
          .filter((id): id is number => id != null),
      });
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error ? err.message : '저장에 실패했어요');
      setIsSaving(false);
    }
  }

  if (view === 'map') {
    // 하단 시트도 설계서 표기대로 "시+구+동"으로 줄여 보여준다.
    const address = currentRegion
      ? `${shortenSido(currentRegion.firstDepth)} ${currentRegion.secondDepth} ${currentRegion.thirdDepth}`.trim()
      : '';

    return (
      <RegionMapPicker
        center={mapCenter}
        address={address}
        loading={isLocating}
        error={locationError}
        recenterToken={recenterToken}
        onCenterChange={handleCenterChange}
        onRetry={loadCurrentLocation}
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
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
            placeholder="동, 지하철역 이름으로 검색"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenCurrentLocation}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-sm text-gray-500"
        >
          <CrosshairIcon className="h-4 w-4" />
          현재 위치로 추가
        </button>

        {isLoading && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">불러오는 중...</p>
        )}

        {!isLoading && loadError && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">{loadError}</p>
        )}

        {!isLoading && !loadError && (
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
        )}
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
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
