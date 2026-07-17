// [I101] 손 상태 선택 (맨손/젤 제거/연장, 자샵/타샵, 개수 선택)

import {
  HAND_STATUS_OPTIONS,
  EXTENSION_REMOVAL_UNIT_PRICE,
  EXTENSION_REMOVAL_MAX_COUNT,
  type HandStatusId,
  type GelRemovalShop,
} from '../../data/reservationData';

interface HandStatusSelectProps {
  selected: HandStatusId[];
  onToggle: (id: HandStatusId) => void;
  gelRemovalShop: GelRemovalShop | null;
  onSelectGelRemovalShop: (shop: GelRemovalShop) => void;
  extensionRemovalCount: number;
  onChangeExtensionRemovalCount: (count: number) => void;
}

export default function HandStatusSelect({
  selected,
  onToggle,
  gelRemovalShop,
  onSelectGelRemovalShop,
  extensionRemovalCount,
  onChangeExtensionRemovalCount,
}: HandStatusSelectProps) {
  const isSelected = (id: HandStatusId) => selected.includes(id);

  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-[#171B1C]">현재 손 상태</h2>

      <div className="mt-4 flex flex-col gap-2">
        {HAND_STATUS_OPTIONS.map((option) => {
          const active = isSelected(option.id);
          return (
            <div key={option.id}>
              <button
                type="button"
                onClick={() => onToggle(option.id)}
                className={`w-full flex items-center justify-between rounded-xl border bg-white px-4 py-3.5 text-left cursor-pointer transition ${
                  active ? 'border-[#F70071]' : 'border-[#E9EBEE]'
                }`}
              >
                <span className="text-sm font-medium text-[#171B1C]">
                  {option.label}
                </span>
                <span className="text-sm font-bold text-[#171B1C]">
                  {option.id === 'EXTENSION_REMOVAL' && active
                    ? `+${(extensionRemovalCount * EXTENSION_REMOVAL_UNIT_PRICE).toLocaleString()}`
                    : `+${option.price.toLocaleString()}`}
                </span>
              </button>

              {option.id === 'GEL_REMOVAL' && active && (
                <div className="mt-2 ml-1 flex gap-2">
                  {(['OWN_SHOP', 'OTHER_SHOP'] as GelRemovalShop[]).map(
                    (shop) => (
                      <button
                        key={shop}
                        type="button"
                        onClick={() => onSelectGelRemovalShop(shop)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-medium cursor-pointer ${
                          gelRemovalShop === shop
                            ? 'border-[#F70071] bg-[#F70071] text-white'
                            : 'border-[#E9EBEE] bg-white text-[#646F7C]'
                        }`}
                      >
                        {shop === 'OWN_SHOP' ? '자샵' : '타샵'}
                      </button>
                    ),
                  )}
                </div>
              )}

              {option.id === 'EXTENSION_REMOVAL' && active && (
                <div className="mt-2 ml-1 flex items-center gap-3">
                  <span className="text-xs text-[#646F7C]">개수</span>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeExtensionRemovalCount(
                        Math.max(1, extensionRemovalCount - 1),
                      )
                    }
                    disabled={extensionRemovalCount <= 1}
                    className="w-7 h-7 rounded-full border border-[#E9EBEE] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {extensionRemovalCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeExtensionRemovalCount(
                        Math.min(
                          EXTENSION_REMOVAL_MAX_COUNT,
                          extensionRemovalCount + 1,
                        ),
                      )
                    }
                    disabled={
                      extensionRemovalCount >= EXTENSION_REMOVAL_MAX_COUNT
                    }
                    className="w-7 h-7 rounded-full border border-[#E9EBEE] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
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
