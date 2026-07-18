import { ART_OPTIONS, ADDITIONAL_OPTIONS } from '../../data/reservationData';

interface OptionSelectorProps {
  selectedArtId: string | null;
  onSelectArt: (id: string) => void;
  additionalCounts: Record<string, number>;
  onChangeAdditionalCount: (id: string, count: number) => void;
}

export default function OptionSelector({
  selectedArtId,
  onSelectArt,
  additionalCounts,
  onChangeAdditionalCount,
}: OptionSelectorProps) {
  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-[#171B1C]">
        아트 선택 <span className="text-[#F70071] text-xs">필수</span>
      </h2>

      <div className="mt-4 flex flex-col gap-2">
        {ART_OPTIONS.map((art) => {
          const active = selectedArtId === art.id;
          return (
            <button
              key={art.id}
              type="button"
              onClick={() => onSelectArt(art.id)}
              className={`w-full flex items-center justify-between rounded-xl border border-[2px] bg-white px-5 py-4 text-left cursor-pointer ${
                active ? 'border-[#F70071]' : 'border-[#E9EBEE]'
              }`}
            >
              <span className="flex items-center gap-2 pb-4 pt-4">
                <span className="text-sm font-bold text-[#171B1C]">
                  {art.label}
                </span>
                <span className="text-[10px] text-[#ADB0B5] bg-[#F7F8FA] rounded-full px-2 py-0.5">
                  {art.badgeMinutes}M
                </span>
              </span>
              <span
                className={`text-sm font-bold ${
                  active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                }`}
              >
                +{art.price}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-8 text-lg font-bold text-[#171B1C]">
        추가 옵션{' '}
        <span className="text-[#ADB0B5] text-xs font-normal">선택</span>
      </h2>

      <div className="mt-4 flex flex-col gap-2">
        {ADDITIONAL_OPTIONS.map((option) => {
          const count = additionalCounts[option.id] ?? 0;
          const active = count > 0;
          return (
            <div
              key={option.id}
              className={`rounded-xl border border-[2px] bg-white px-5 py-4 ${
                active ? 'border-[#F70071]' : 'border-[#E9EBEE]'
              }`}
            >
              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#171B1C]">
                    {option.label} (1ea)
                  </span>
                  <span className="text-[10px] text-[#ADB0B5] bg-[#F7F8FA] rounded-full px-2 py-0.5">
                    {option.badgeMinutes}M
                  </span>
                </span>
                <span
                  className={`text-sm font-bold ${
                    active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                  }`}
                >
                  +{count * option.unitPrice}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 pb-2">
                <button
                  type="button"
                  onClick={() =>
                    onChangeAdditionalCount(option.id, Math.max(0, count - 1))
                  }
                  disabled={count <= 0}
                  className="w-6 h-6 rounded-full border border-[#E9EBEE] text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>
                <span className="text-sm font-bold w-4 text-center">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChangeAdditionalCount(
                      option.id,
                      Math.min(option.maxCount, count + 1),
                    )
                  }
                  disabled={count >= option.maxCount}
                  className="w-6 h-6 rounded-full border border-[#E9EBEE] text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}