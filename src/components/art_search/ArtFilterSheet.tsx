import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LocationFilter from './LocationFilter';
import PriceFilter from './PriceFilter';
import ArtTypeFilter from './ArtTypeFilter';
import DesignFilter from './DesignFilter';
import { type ArtType, mockCardResponse } from '../../data/mockupdata/nailData';

export interface FilterState {
  regions: string[];
  minPrice: number;
  maxPrice: number;
  artType: ArtType | 'ALL';
  designs: string[];
}

interface ArtFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onNavigateToLocationSearch: () => void | Promise<void>;
}

export default function ArtFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
}: ArtFilterSheetProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleToggleRegion = (region: string) => {
    setTempFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }));
  };

  const handleToggleDesign = (design: string) => {
    setTempFilters((prev) => ({
      ...prev,
      designs: prev.designs.includes(design)
        ? prev.designs.filter((d) => d !== design)
        : [...prev.designs, design],
    }));
  };

  const filteredCount = mockCardResponse.result.cards.filter((card) => {
    if (tempFilters.regions.length > 0 && !tempFilters.regions.includes(card.region_name)) {
      return false;
    }

    if (card.max_price < tempFilters.minPrice || card.min_price > tempFilters.maxPrice) {
      return false;
    }

    if (tempFilters.artType !== 'ALL' && card.art_type !== tempFilters.artType) {
      return false;
    }

    return true;
  }).length;

  return createPortal(
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] bg-white flex flex-col border-x border-[#eceef1]">
      <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#eceef1]">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-[#868e96] hover:text-[#495057] transition-colors"
        >
          취소
        </button>
        <span className="text-base font-bold text-[#1d2026]">필터</span>
        <button
          type="button"
          onClick={() => {
            setTempFilters({
              regions: [],
              minPrice: 0,
              maxPrice: 200000,
              artType: 'ALL',
              designs: [],
            });
          }}
          className="text-sm font-medium text-[#868e96] hover:text-[#495057] transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="border-b border-[#eceef1] pb-4">
          <LocationFilter
            selectedRegions={tempFilters.regions}
            onToggleRegion={handleToggleRegion}
          />
        </div>

        <div className="border-b border-[#eceef1] pb-4">
          <PriceFilter
            minPrice={tempFilters.minPrice}
            maxPrice={tempFilters.maxPrice}
            onChangePrice={(min, max) =>
              setTempFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
            }
          />
        </div>

        <div className="border-b border-[#eceef1] pb-4">
          <ArtTypeFilter
            selectedType={tempFilters.artType}
            onChangeType={(type) =>
              setTempFilters((prev) => ({ ...prev, artType: type as ArtType | 'ALL' }))
            }
          />
        </div>

        <div className="pb-4">
          <DesignFilter
            selectedDesigns={tempFilters.designs}
            onToggleDesign={handleToggleDesign}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-50 z-40">
        <button
          type="button"
          onClick={() => {
            onApply(tempFilters);
            onClose();
          }}
          className="w-full rounded-2xl bg-[#FF007A] py-4 text-center text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          {filteredCount}개 결과보기
        </button>
      </div>
    </div>,
    document.body
  );
}