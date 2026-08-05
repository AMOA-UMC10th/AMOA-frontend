import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '../onboarding/SearchBar';
import RegionResult from '../onboarding/RegionResult';
import RegionChips, { type SelectedRegion } from '../onboarding/RegionChips';
import { ChevronLeftIcon, CrosshairIcon, MapPinIcon } from '../../assets/icons';
import { searchRegions, type RegionMatch } from '../../data/region';

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const MAP_LEVEL = 6;

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMap {
  getCenter: () => KakaoLatLng;
  setCenter: (latlng: KakaoLatLng) => void;
  relayout: () => void;
}

interface KakaoMaps {
  load: (callback: () => void) => void;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  event: {
    addListener: (target: KakaoMap, type: string, handler: () => void) => void;
  };
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

let sdkPromise: Promise<KakaoMaps> | null = null;

function loadKakaoSdk(): Promise<KakaoMaps> {
  if (!KAKAO_JS_KEY) {
    return Promise.reject(new Error('지도 키(VITE_KAKAO_JS_KEY)가 설정되지 않았어요.'));
  }
  if (window.kakao?.maps?.Map) {
    return Promise.resolve(window.kakao.maps);
  }
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error('지도를 불러오지 못했어요.'));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

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

  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addressText, setAddressText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recenterToken, setRecenterToken] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const fetchAddressFromAPI = async (lat: number, lng: number) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(
        `https://api.amoa.beauty/api/v1/regions/present?latitude=${lat}&longitude=${lng}`,
        { cache: 'no-store' }
      );

      if (!response.ok) throw new Error('API 오류');

      const data = await response.json();

      if (!data.isSuccess || !data.result) {
        throw new Error(data.message || '주소를 가져오지 못했어요.');
      }

      const { secondDepth, thirdDepth } = data.result;
      const address = [secondDepth, thirdDepth].filter(Boolean).join(' ');

      if (!address) {
        throw new Error('주소를 가져오지 못했어요.');
      }

      setAddressText(address);
    } catch (err) {
      console.error(err);
      setAddressText('');
      setErrorMsg('주소를 가져오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 지도 이동마다 바로 호출하지 않고 400ms 안에 추가 이동이 없을 때만 API를 호출한다.
  const onCenterChange = (lat: number, lng: number) => {
    setCurrentCoords({ latitude: lat, longitude: lng });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressFromAPI(lat, lng);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  });

  const fetchCurrentLocation = () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg('위치 정보를 지원하지 않는 브라우저입니다.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurrentCoords({ latitude, longitude });
        setRecenterToken((prev) => prev + 1);

        fetchAddressFromAPI(latitude, longitude);
      },
      (error) => {
        console.error(error);
        setErrorMsg('현재 위치를 가져오지 못했습니다.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleOpenMap = () => {
    setView('map');
    fetchCurrentLocation();
  };

  useEffect(() => {
    if (view !== 'map' || !currentCoords || !mapContainerRef.current || mapRef.current) return;

    let cancelled = false;

    loadKakaoSdk()
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) return;

        const map = new maps.Map(mapContainerRef.current, {
          center: new maps.LatLng(currentCoords.latitude, currentCoords.longitude),
          level: MAP_LEVEL,
        });
        mapRef.current = map;

        requestAnimationFrame(() => map.relayout());

        maps.event.addListener(map, 'dragend', () => {
          const c = map.getCenter();
          onCenterChangeRef.current?.(c.getLat(), c.getLng());
        });
      })
      .catch((err: Error) => {
        if (!cancelled) setMapError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [view, currentCoords]);

  useEffect(() => {
    if (view === 'search') {
      mapRef.current = null;
      setMapError(null);
    }
  }, [view]);

  const appliedTokenRef = useRef(recenterToken);
  useEffect(() => {
    if (recenterToken === appliedTokenRef.current) return;
    appliedTokenRef.current = recenterToken;

    const maps = window.kakao?.maps;
    if (!maps || !mapRef.current || !currentCoords) return;

    mapRef.current.setCenter(new maps.LatLng(currentCoords.latitude, currentCoords.longitude));
  }, [recenterToken, currentCoords]);

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
    if (addressText) {
      addRegion({ label: addressText });
    }
    setView('search');
  }

  const canConfirm = !isLoading && !errorMsg && addressText.length > 0;

  if (view === 'map') {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex min-h-screen flex-col bg-white">
          <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
            <button
              type="button"
              onClick={() => setView('search')}
              aria-label="뒤로가기"
              className="absolute left-4 text-gray-700"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-sm font-medium text-gray-900">현재 위치로 추가</h1>
          </header>

          <div className="relative flex-1 overflow-hidden bg-gray-100">
            <div ref={mapContainerRef} className="absolute inset-0" />

            {mapError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 px-8 text-center">
                <p className="text-sm text-gray-400">{mapError}</p>
              </div>
            )}

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
              <MapPinIcon className="h-9 w-9 text-[#F70071] drop-shadow" />
            </div>
          </div>

          <div className="shrink-0 rounded-t-3xl border-t border-gray-100 px-5 pb-8 pt-5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
            <p className="text-xs text-gray-400">현재 위치</p>

            {isLoading && (
              <p className="mt-1 text-base font-semibold text-gray-300">
                현재 위치를 확인하는 중...
              </p>
            )}

            {!isLoading && errorMsg && (
              <div className="mt-1 flex items-start justify-between gap-3">
                <p className="text-sm text-gray-500">{errorMsg}</p>
                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  className="shrink-0 text-sm font-semibold text-[#F70071]"
                >
                  다시 시도
                </button>
              </div>
            )}

            {!isLoading && !errorMsg && (
              <p className="mt-1 text-base font-semibold text-gray-900">{addressText}</p>
            )}

            <button
              type="button"
              disabled={!canConfirm}
              onClick={handleConfirmCurrentLocation}
              className={`mt-4 w-full rounded-2xl py-4 text-sm font-semibold text-white ${
                canConfirm ? 'bg-[#F70071]' : 'bg-[#FFC0DC]'
              }`}
            >
              이 위치로 추가
            </button>
          </div>
        </div>
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
          onClick={handleOpenMap}
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