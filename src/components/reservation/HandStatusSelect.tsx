import {
  HAND_STATUS_OPTIONS,
  EXTENSION_REMOVAL_UNIT_PRICE,
  EXTENSION_REMOVAL_MAX_COUNT,
  GEL_REMOVAL_OTHER_SHOP_SURCHARGE,
  type HandStatusId,
  type GelRemovalShop,
} from '../../data/mockupdata/reservationData';

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

  const getDisplayPrice = (option: (typeof HAND_STATUS_OPTIONS)[number]) => {
    if (option.id === 'EXTENSION_REMOVAL') {
      return extensionRemovalCount * EXTENSION_REMOVAL_UNIT_PRICE;
    }
    if (option.id === 'GEL_REMOVAL' && gelRemovalShop === 'OTHER_SHOP') {
      return option.price + GEL_REMOVAL_OTHER_SHOP_SURCHARGE;
    }
    return option.price;
  };

  return (
    <div className="px-[15px] pt-8">
      <h2 className="text-[17px] font-semibold text-[#000000]">현재 손 상태</h2>

      <div className="mt-[20px] flex flex-col gap-[20px]">
        {HAND_STATUS_OPTIONS.map((option) => {
          const active = isSelected(option.id);
          return (
            <div
              key={option.id}
              className={`rounded-[12px] border-[1.5px] bg-white px-[20px] transition ${
                active && option.id !== 'BARE' ? 'py-[25px]' : 'py-[28px]'
              } ${active ? 'border-[#F70071]' : 'border-[#D4D7DC]'}`}
            >
              <button
                type="button"
                onClick={() => onToggle(option.id)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#171B1C]">
                    {option.label}
                    {option.id === 'EXTENSION_REMOVAL' ? ' (1ea)' : ''}
                  </span>
                  {option.badgeMinutes != null && (
                    <span className="text-[10px] text-[#ADB0B5] bg-[#F7F8F9] rounded-[9.5px] px-[8px] py-[2px]">
                      {option.badgeMinutes}M
                    </span>
                  )}
                </span>
                <span
                  className={`text-[13px] font-medium ${
                    active ? 'text-[#F70071]' : 'text-[#ADB0B5]'
                  }`}
                >
                  {active ? `+${getDisplayPrice(option)}` : `+${option.price}`}
                </span>
              </button>

              {option.id === 'GEL_REMOVAL' && active && (
                <div className="mt-[7px] flex gap-2">
                  {(['OWN_SHOP', 'OTHER_SHOP'] as GelRemovalShop[]).map(
                    (shop) => (
                      <button
                        key={shop}
                        type="button"
                        onClick={() => onSelectGelRemovalShop(shop)}
                        className={`rounded-[13.5px] border py-[4px] px-[13px] text-[13px] font-medium cursor-pointer ${
                          gelRemovalShop === shop
                            ? 'border-none bg-[#F70071] text-white'
                            : 'border-none bg-[#F7F8F9] text-[#646F7C]'
                        }`}
                      >
                        {shop === 'OWN_SHOP' ? '자샵' : '타샵'}
                      </button>
                    ),
                  )}
                </div>
              )}

              {option.id === 'EXTENSION_REMOVAL' && active && (
                <div className="mt-[9px] flex items-center gap-[5px]">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeExtensionRemovalCount(
                        Math.max(1, extensionRemovalCount - 1),
                      )
                    }
                    disabled={extensionRemovalCount <= 1}
                    className="w-[20px] h-[20px] text-xs flex items-center justify-center rounded-full border border-[0.71px] border-[#E0E0E0] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="text-[14px] w-[16px] font-bold text-center">
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
                    className="w-[20px] h-[20px] text-xs flex items-center justify-center rounded-full border border-[0.71px] border-[#E0E0E0] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
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
