import {
  ART_OPTIONS,
  ADDITIONAL_OPTIONS,
} from '../../data/mockupdata/reservationData';

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
      <h2 className="text-lg font-normal text-[#171B1C]">
        아트 선택 <span className="text-xs text-[#F70071]">필수</span>
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
        <span className="text-xs font-normal text-[#ADB0B5]">선택</span>
      </h2>

      <div className="mt-4 flex flex-col gap-2">
        {ADDITIONAL_OPTIONS.map((option) => {
          const count = additionalCounts[option.id] ?? 0;
          const active = count > 0;

          const handleSelectOption = () => {
            onChangeAdditionalCount(option.id, active ? 0 : 1);
          };

          const handleDecrease = (
            event: React.MouseEvent<HTMLButtonElement>,
          ) => {
            event.stopPropagation();

            onChangeAdditionalCount(option.id, Math.max(0, count - 1));
          };

          const handleIncrease = (
            event: React.MouseEvent<HTMLButtonElement>,
          ) => {
            event.stopPropagation();

            onChangeAdditionalCount(
              option.id,
              Math.min(option.maxCount, count + 1),
            );
          };

          return (
            <div
              key={option.id}
              role="button"
              tabIndex={0}
              onClick={handleSelectOption}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onChangeAdditionalCount(option.id, active ? 0 : 1);
                }
              }}
              className={`w-full rounded-xl border-2 bg-white px-5 py-7.5 ${
                active ? 'border-[#F70071]' : 'cursor-pointer border-[#E9EBEE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#171B1C]">
                    {option.label} (1ea)
                  </span>

                  <span className="rounded-full bg-[#F7F8FA] px-2 py-0.5 text-[10px] text-[#ADB0B5]">
                    {option.badgeMinutes}M
                  </span>
                </span>

                <span
                  className={`text-sm font-bold ${
                    active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                  }`}
                >
                  +
                  {(active
                    ? count * option.unitPrice
                    : option.unitPrice
                  ).toLocaleString()}
                </span>
              </div>

              {active && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={count <= 0}
                    aria-label={`${option.label} 수량 줄이기`}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E9EBEE] text-xs text-[#171B1C] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="w-4 text-center text-sm font-bold text-[#171B1C]">
                    {count}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={count >= option.maxCount}
                    aria-label={`${option.label} 수량 늘리기`}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E9EBEE] text-xs text-[#171B1C] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
