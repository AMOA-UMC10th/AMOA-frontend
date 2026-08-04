//A103 현재 위치로 추가 - 카카오맵 기반 위치 선택 화면
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, MapPinIcon } from "../../assets/icons";

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
// 반경 500m~1km 정도가 보이는 축척 (Figma A103 스펙)
const MAP_LEVEL = 6;

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMap {
  getCenter: () => KakaoLatLng;
  setCenter: (latlng: KakaoLatLng) => void;
  // 컨테이너 크기가 지도 생성 이후에 정해졌을 때 다시 그리게 한다.
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

// SDK는 한 번만 받아오고, 이후 화면 재진입에서는 같은 Promise를 재사용한다.
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
      // autoload=false라서 직접 load를 호출해야 kakao.maps가 채워진다.
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
  // 값이 바뀔 때마다 지도를 center로 되돌린다. [다시 시도]처럼 부모가 위치를 다시 잡은
  // 경우에만 올려주면 된다. 넘기지 않으면 지도는 사용자가 드래그한 자리를 유지한다.
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

  // 부모가 매번 새 함수를 넘겨도 지도를 다시 만들지 않도록 ref로 들고 있는다.
  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  // 좌표를 처음 받은 시점에 지도를 만든다. 이후 드래그로 옮긴 중심은 지도가 갖고 있으므로
  // center가 갱신돼도 다시 setCenter 하지 않는다. (그러면 드래그가 되돌아간다)
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

        // 생성 직후 컨테이너 크기가 아직 0이면 타일이 안 그려진 채로 굳는다.
        // 다음 프레임에 한 번 더 크기를 재보게 해서 회색 화면으로 남는 걸 막는다.
        requestAnimationFrame(() => map.relayout());

        // 드래그가 끝나면 중앙 핀 위치를 기준으로 주소를 다시 조회한다.
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

  // 부모가 위치를 다시 잡으면(=[다시 시도]) 지도도 그 좌표로 되돌린다.
  // 이게 없으면 드래그로 옮겨둔 지도는 그대로인데 하단 주소만 현재 위치로 바뀌어서
  // 핀이 가리키는 곳과 주소가 어긋난다.
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
        {/* h-full(=height:100%)은 부모가 flex-1/min-h-screen이라 참조할 확정 높이가 없어
            0으로 잡힌다. 높이 0이면 카카오맵이 타일을 그리지 않아 회색만 보인다.
            부모가 relative이므로 absolute로 박스에 직접 붙인다. */}
        <div ref={containerRef} className="absolute inset-0" />

        {mapError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 px-8 text-center">
            <p className="text-sm text-gray-400">{mapError}</p>
          </div>
        )}

        {/* 지도 중앙 고정 핀. 지도를 드래그해도 핀은 화면 가운데에 그대로 있는다.
            카카오맵이 컨테이너 안에 z-index를 가진 DOM을 깔기 때문에 핀을 명시적으로 올려야
            가려지지 않는다. */}
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