//A103 현재 위치로 추가 - 지도 플레이스홀더 화면 (추후 실제 지도 SDK 연동)
import { ChevronLeftIcon, MapPinIcon } from "../../assets/icons";

interface RegionMapPickerProps {
  address: string;
  onBack: () => void;
  onConfirm: () => void;
}

export default function RegionMapPicker({
  address,
  onBack,
  onConfirm,
}: RegionMapPickerProps) {
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

      <div
        className="relative flex-1 overflow-hidden bg-gray-100"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <MapPinIcon className="h-9 w-9 text-black drop-shadow" />
        </div>
      </div>

      <div className="shrink-0 rounded-t-3xl border-t border-gray-100 px-5 pb-8 pt-5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <p className="text-xs text-gray-400">현재 위치</p>
        <p className="mt-1 text-base font-semibold text-gray-900">{address}</p>
        <button
          type="button"
          onClick={onConfirm}
          className="mt-4 w-full rounded-2xl bg-black py-4 text-sm font-semibold text-white"
        >
          이 위치로 추가
        </button>
      </div>
    </div>
  );
}
