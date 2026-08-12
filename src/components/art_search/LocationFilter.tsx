import React, { useState } from 'react';
import { ChevronRightSmallIcon, XIcon } from '../../assets/icons';
import LocationSearchPage from './LocationSearchPage';
import type { SelectedRegion } from '../onboarding/RegionChips';

export interface RegionSelection {
  id: number;
  label: string;
}

interface LocationFilterProps {
  selectedRegions: RegionSelection[];
  onApplyRegions: (regions: RegionSelection[]) => void;
  onRemoveRegion: (regionId: number) => void;
}

export default function LocationFilter({
  selectedRegions = [],
  onApplyRegions,
  onRemoveRegion,
}: LocationFilterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleApply = (selected: SelectedRegion[]) => {
    const formattedRegions: RegionSelection[] = selected.map((item) => ({
      id: Number(item.id) || Date.now(),
      label:
        item.district && item.keyword
          ? `${item.district.split(' ').pop()} ${item.keyword}`
          : item.label || item.district || '',
    }));

    if (onApplyRegions) {
      onApplyRegions(formattedRegions);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-[#1d2026]">위치</span>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5 text-left text-sm text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <span>위치 추가</span>
          <ChevronRightSmallIcon className="h-3 w-3 text-gray-400" />
        </button>

        {selectedRegions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {selectedRegions.map((region) => (
              <span
                key={region.id}
                className="flex items-center gap-1.5 rounded-full bg-[#F70071] py-1.5 pl-3 pr-2.5 text-xs text-white"
              >
                {region.label}
                <button
                  type="button"
                  onClick={() => onRemoveRegion(region.id)}
                  aria-label={`${region.label} 삭제`}
                  className="text-white/80 hover:text-white"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isSearchOpen && (
        <LocationSearchPage
          initialSelected={selectedRegions.map((r) => ({
            id: String(r.id),
            label: r.label,
          }))}
          onClose={() => setIsSearchOpen(false)}
          onApply={handleApply}
        />
      )}
    </>
  );
}