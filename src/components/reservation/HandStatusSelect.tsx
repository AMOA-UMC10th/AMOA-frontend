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
    <div className="px-5 pt-8">
      <h2 className="text-lg font-bold text-[#171B1C]">현재 손 상태</h2>

      <div className="mt-4 flex flex-col gap-2 pt-3">
        {HAND_STATUS_OPTIONS.map((option) => {
          const active = isSelected(option.id);
          return (
            <div
              key={option.id}
              className={`rounded-xl border border-[2px] bg-white px-4 pt-3.5 transition ${
                option.id === 'BARE' ? 'pb-9' : 'pb-8'
              } ${active ? 'border-[#F70071]' : 'border-[#D4D7DC]'}`}
            >
              <button
                type="button"
                onClick={() => onToggle(option.id)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <span className="pt-5 pl-1 text-md font-bold text-[#171B1C]">
                  {option.label}
                  {option.id === 'EXTENSION_REMOVAL' ? ' (1ea)' : ''}
                </span>
                <span
                  className={`pt-5 text-md font-bold ${
                    active ? 'text-[#F70071]' : 'text-[#171B1C]'
                  }`}
                >
                  {option.id === 'EXTENSION_REMOVAL' && active
                    ? `+${extensionRemovalCount * EXTENSION_REMOVAL_UNIT_PRICE}`
                    : `+${option.price}`}
                </span>
              </button>

              {option.id === 'GEL_REMOVAL' && active && (
                <div className="mt-3 flex gap-2 pb-3">
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
                <div className="mt-3 flex items-center gap-3 pb-3">
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
                  <span className="text-sm font-bold w-4 text-center">
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
