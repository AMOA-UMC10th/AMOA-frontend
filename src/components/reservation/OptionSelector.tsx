import type { ArtOption, AdditionalOption } from '../../data/reservationAPI';

interface OptionSelectorProps {
  artOptions: ArtOption[]; // 추가 — 실제 API로 받아온 아트 옵션
  additionalOptions: AdditionalOption[]; // 추가 — 실제 API로 받아온 추가 옵션
  selectedArtId: number | null; // string → number
  onSelectArt: (id: number) => void; // string → number
  additionalCounts: Record<number, number>; // Record<string, number> → Record<number, number>
  onChangeAdditionalCount: (id: number, count: number) => void; // string → number
}

export default function OptionSelector({
  artOptions,
  additionalOptions,
  selectedArtId,
  onSelectArt,
  additionalCounts,
  onChangeAdditionalCount,
}: OptionSelectorProps) {
  return (
    <div className="px-[15px] pt-8">
      <h2 className="text-[17px] font-semibold text-[#000000]">
        아트 선택{' '}
        <span className="text-[11px] font-medium text-[#F70071]">필수</span>
      </h2>

      <div className="mt-[20px] flex flex-col gap-[12px]">
        {artOptions.map((art) => {
          const active = selectedArtId === art.id;
          return (
            <button
              key={art.id}
              type="button"
              onClick={() => onSelectArt(art.id)}
              className={`w-full flex items-center justify-between rounded-[12px] border border-[1.5px] bg-white px-[20px] py-[28px] text-left cursor-pointer ${
                active ? 'border-[#F70071]' : 'border-[#E9EBEE]'
              }`}
            >
              <span className="flex items-center gap-[4px]">
                <span className="text-[13px] font-semibold text-[#171B1C]">
                  {art.label}
                </span>
                <span className="text-[10px] font-medium text-[#ADB0B5] bg-[#F7F8F9] rounded-[9.5px] px-[8px] py-[2px]">
                  {art.badgeMinutes}M
                </span>
              </span>
              <span
                className={`text-[13px] font-medium ${
                  active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                }`}
              >
                +{art.price}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-[19px] text-[17px] font-semibold text-[#000000] gap-[4px]">
        추가 옵션{' '}
        <span className="text-[11px] font-medium text-[#ADB0B5]">선택</span>
      </h2>

      <div className="mt-[20px] flex flex-col gap-[12px]">
        {additionalOptions.map((option) => {
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
              className={`w-full rounded-[12px] border-[1.5px] bg-white px-[20px] ${
                active ? 'border-[#F70071]' : 'cursor-pointer border-[#E9EBEE]'
              } ${active ? 'py-[25px]' : 'py-[28px]'}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-[4px]">
                  <span className="text-[13px] font-semibold text-[#171B1C]">
                    {option.label} (1ea)
                  </span>
                  <span className="rounded-[9.5px] bg-[#F7F8F9] px-[8px] py-[2px] text-[10px] text-[#ADB0B5]">
                    {option.badgeMinutes}M
                  </span>
                </span>
                <span
                  className={`text-[13px] font-medium ${
                    active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                  }`}
                >
                  +{active ? count * option.unitPrice : option.unitPrice}
                </span>
              </div>

              {active && (
                <div className="mt-[9px] flex items-center gap-[5px]">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={count <= 0}
                    aria-label={`${option.label} 수량 줄이기`}
                    className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full border border-[#E0E0E0] text-xs text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-[16px] text-center text-[14px] font-bold text-[#000000]">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={count >= option.maxCount}
                    aria-label={`${option.label} 수량 늘리기`}
                    className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full border border-[#E0E0E0] text-xs text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
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
