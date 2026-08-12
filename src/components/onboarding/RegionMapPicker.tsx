//A103 현재 위치로 추가 - 카카오맵 기반 위치 선택 화면
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, MapPinIcon } from "../../assets/icons";

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
    return Promise.reject(
      new Error("지도 키(VITE_KAKAO_JS_KEY)가 설정되지 않았어요.")
    );
  }
  if (window.kakao?.maps?.Map) {
    return Promise.resolve(window.kakao.maps);
  }
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("지도를 불러오지 못했어요."));
    };
    document.head.appendChild(script);
  });

  return sdkPromise;
}

interface RegionMapPickerProps {
  center: { latitude: number; longitude: number } | null;
  address: string;
  loading?: boolean;
  error?: string | null;
  recenterToken?: number;
  onCenterChange?: (latitude: number, longitude: number) => void;
  onRetry?: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function RegionMapPicker({
  center,
  address,
  loading = false,
  error = null,
  recenterToken,
  onCenterChange,
  onRetry,
  onBack,
  onConfirm,
}: RegionMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    if (!center || !containerRef.current || mapRef.current) return;

    let cancelled = false;

    loadKakaoSdk()
      .then((maps) => {
        if (cancelled || !containerRef.current) return;

        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(center.latitude, center.longitude),
          level: MAP_LEVEL,
        });
        mapRef.current = map;

        requestAnimationFrame(() => map.relayout());

        maps.event.addListener(map, "dragend", () => {
          const c = map.getCenter();
          onCenterChangeRef.current?.(c.getLat(), c.getLng());
        });
        maps.event.addListener(map, "zoom_changed", () => {
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
  }, [center]);

  const appliedTokenRef = useRef(recenterToken);
  useEffect(() => {
    if (recenterToken === appliedTokenRef.current) return;
    appliedTokenRef.current = recenterToken;

    const maps = window.kakao?.maps;
    if (!maps || !mapRef.current || !center) return;

    mapRef.current.setCenter(new maps.LatLng(center.latitude, center.longitude));
  }, [recenterToken, center]);

  const canConfirm = !loading && !error && address.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">현재 위치로 추가</h1>
      </header>

      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div ref={containerRef} className="absolute inset-0" />

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

        {loading && (
          <p className="mt-1 text-base font-semibold text-gray-300">
            현재 위치를 확인하는 중...
          </p>
        )}

        {!loading && error && (
          <div className="mt-1 flex items-start justify-between gap-3">
            <p className="text-sm text-gray-500">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="shrink-0 text-sm font-semibold text-[#F70071]"
              >
                다시 시도
              </button>
            )}
          </div>
        )}

        {!loading && !error && (
          <p className="mt-1 text-base font-semibold text-gray-900">{address}</p>
        )}

        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className={`mt-4 w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            canConfirm ? "bg-[#F70071]" : "bg-[#FFC0DC]"
          }`}
        >
          이 위치로 추가
        </button>
      </div>
    </div>
  );
}