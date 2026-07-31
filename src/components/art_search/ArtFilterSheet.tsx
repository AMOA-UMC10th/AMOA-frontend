import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LocationFilter, { type RegionSelection } from './LocationFilter';
import PriceFilter from './PriceFilter';
import ArtTypeFilter from './ArtTypeFilter';
import DesignFilter from './DesignFilter';
import { fetchCards } from '../../data/card';

export interface FilterState {
  regions: RegionSelection[];
  minPrice: number;
  maxPrice: number;
  artType: string;
  designs: number[];
}

interface ArtFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

export default function ArtFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
}: ArtFilterSheetProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      try {
        const result = await fetchCards({
          regionIds: tempFilters.regions.map((r) => r.id),
          minPrice: tempFilters.minPrice,
          maxPrice: tempFilters.maxPrice,
          artType:
            tempFilters.artType === 'ALL' || !tempFilters.artType
              ? undefined
              : tempFilters.artType,
          designTagIds: tempFilters.designs,
          // 필터링된 전체 카드 수를 측정하기 위해 충분한 사이즈로 요청
          size: 100,
        });

        // 6~12 제외 후 실제 필터링된 개수를 하단 버튼에 표시
        setTotalCount(result.cards.length);
      } catch (error) {
        console.error(error);
        setTotalCount(0);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen, tempFilters]);

  if (!isOpen) return null;

  const handleApplyRegions = (regions: RegionSelection[]) => {
    setTempFilters((prev) => ({
      ...prev,
      regions,
    }));
  };

  const handleRemoveRegion = (regionId: number) => {
    setTempFilters((prev) => ({
      ...prev,
      regions: prev.regions.filter((r) => r.id !== regionId),
    }));
  };

  const handleToggleDesign = (designTagId: number) => {
    setTempFilters((prev) => ({
      ...prev,
      designs: prev.designs.includes(designTagId)
        ? prev.designs.filter((id) => id !== designTagId)
        : [...prev.designs, designTagId],
    }));
  };

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
              artType: '',
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
            onApplyRegions={handleApplyRegions}
            onRemoveRegion={handleRemoveRegion}
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
              setTempFilters((prev) => ({ ...prev, artType: type }))
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
          {totalCount}개 결과보기
        </button>
      </div>
    </div>,
    document.body
  );
}