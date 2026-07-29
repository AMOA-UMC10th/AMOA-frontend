// [F104] 관심 지역 재설정 화면
//
// 온보딩(A103)과는 별개의 독립 화면이다. 마이페이지에서 진입하고, 뒤로가기는 마이페이지로 나간다.
// 화면 구성 요소는 온보딩과 같아서 components/onboarding의 컴포넌트를 그대로 쓰고,
// "기존 값을 불러와 고친다"는 이 화면만의 동작을 여기서 담당한다.
//
// 설계서 1번 항목:
// - 진입 시 이전에 추가했던 지역이 칩으로 미리 노출된 상태로 표시됨
// - 개별 칩을 삭제하거나 새 지역을 추가로 검색·등록하는 방식으로 수정
// - 최대 3개 지역, 다중 선택 가능

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
// 이 화면 안에서만 regionId를 덧붙여 들고 다닌다. (온보딩 RegionPage와 동일)
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

// 내 프로필(GET /users/me/profile)은 지역 이름을 regionNDepthName으로 내려준다.
// 지역 검색(GET /regions)의 firstDepth/secondDepth/thirdDepth와 필드명이 다르다.
function profileRegionToSelected(region: InterestedRegion): SelectedRegionWithId {
  return {
    id: String(region.regionId),
    regionId: region.regionId,
    district: `${region.region1DepthName} ${region.region2DepthName}`.trim(),
    keyword: region.region3DepthName,
  };
}

export default function MyRegionReconfigPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selected, setSelected] = useState<SelectedRegionWithId[]>([]);

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
        setProfile(myProfile);
        setSelected(myProfile.interestedRegions.map(profileRegionToSelected));
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
        (region.label && r.label === region.label),
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
      setCurrentRegion(await getPresentRegion(latitude, longitude));
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
    // 검색 결과로 담을 때와 같은 모양으로 넣어야 중복 판정과 칩 표기가 맞는다.
    addRegion({
      regionId: currentRegion.regionId,
      district: `${currentRegion.firstDepth} ${currentRegion.secondDepth}`.trim(),
      keyword: currentRegion.thirdDepth,
    });
    setView('search');
  }

  function handleBack() {
    navigate('/mypage');
  }

  const canSave = selected.length > 0 && !isSaving;

  // PATCH는 디자인태그와 관심지역을 둘 다 필수로 받고, 빈 배열을 보내면 전체 삭제된다.
  // 이 화면에서 건드리지 않는 디자인태그는 조회해온 값을 그대로 다시 보내 유지시킨다.
  async function handleSave() {
    if (!canSave || !profile) return;

    const regionIds = selected
      .map((r) => r.regionId)
      .filter((id): id is number => id != null);

    setIsSaving(true);
    try {
      await updateMyProfile({
        selectedDesignTagIds: profile.selectedDesignTagIds,
        interestedRegionIds: regionIds,
      });
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error ? err.message : '저장에 실패했어요');
      setIsSaving(false);
    }
  }

  if (view === 'map') {
    const address = currentRegion
      ? `${currentRegion.firstDepth} ${currentRegion.secondDepth} ${currentRegion.thirdDepth}`.trim()
      : '';

    return (
      <RegionMapPicker
        center={mapCenter}
        address={address}
        loading={isLocating}
        error={locationError}
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
          onClick={handleBack}
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

        <div className="mt-4">
          {isLoading && (
            <p className="py-10 text-center text-sm text-[#ADB0B5]">불러오는 중...</p>
          )}

          {!isLoading && loadError && (
            <p className="py-10 text-center text-sm text-[#ADB0B5]">{loadError}</p>
          )}

          {!isLoading &&
            !loadError &&
            (query.trim().length > 0 ? (
              <RegionResult
                results={results}
                loading={isSearching}
                onSelect={handleSelectResult}
              />
            ) : (
              <RegionChips regions={selected} onRemove={handleRemoveRegion} />
            ))}
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
          {isSaving ? '저장 중...' : '저장'}
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