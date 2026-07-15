//B101-1 위치 필터import React from 'react';

const REGIONS = [
  '마포구',
  '강남구',
  '서초구',
  '송파구',
  '용산구',
  '성동구',
  '광진구',
  '종로구',
  '중구',
  '영등포구',
];

interface LocationFilterProps {
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
}

export default function LocationFilter({
  selectedRegions,
  onToggleRegion,
}: LocationFilterProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-[#1d2026]">지역</h3>
        <span className="text-[11px] text-gray-400">중복 선택 가능</span>
      </div>

      {/* 가로/세로 유연하게 줄바꿈되며 배치되는 칩 리스트 */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((region) => {
          const isSelected = selectedRegions.includes(region);
          return (
            <button
              key={region}
              type="button"
              onClick={() => onToggleRegion(region)}
              className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                isSelected
                  ? 'border-[#FF007A] bg-[#FFF0F6] text-[#FF007A]'
                  : 'border-[#eceef1] bg-white text-[#56606d] hover:bg-gray-50'
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>
    </div>
  );
}