import React, { useState, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchRegions, type RegionMatch } from '../../data/mockupdata/regionData';

interface LocationFilterProps {
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
}

export default function LocationFilter({
  selectedRegions,
  onToggleRegion,
}: LocationFilterProps) {
  const [keyword, setKeyword] = useState('');

  const searchResults = useMemo(() => {
    return searchRegions(keyword);
  }, [keyword]);

  const formatLabel = (item: RegionMatch) => item.shortDistrict;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold text-[#1d2026]">위치 지역</span>

      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl bg-[#f5f6f8] px-4 py-3">
          <FiSearch className="text-[#adb5bd] text-sm shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="동, 역 이름으로 위치 검색"
            className="w-full bg-transparent text-xs text-[#1d2026] outline-none placeholder:text-[#adb5bd]"
          />
          {keyword !== '' && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-[#dee2e6] text-white"
            >
              <FiX size={10} />
            </button>
          )}
        </div>
      </div>

      {keyword.trim() !== '' && (
        <div className="max-h-40 overflow-y-auto border border-[#f1f3f5] rounded-xl bg-white divide-y divide-[#f1f3f5]">
          {searchResults.length > 0 ? (
            searchResults.map((item) => {
              const label = formatLabel(item);
              const isSelected = selectedRegions.includes(label);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onToggleRegion(label);
                    setKeyword('');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex justify-between items-center ${
                    isSelected ? 'bg-pink-50 text-[#FF007A] font-semibold' : 'text-[#1d2026] hover:bg-gray-50'
                  }`}
                >
                  <span>{item.district}</span>
                  {isSelected && <span className="text-[10px]">선택됨</span>}
                </button>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {selectedRegions.map((region) => {
            // "강서구 강서구"처럼 중복되어 들어온 문자열이 있다면 한 번만 나오도록 전처리
            const words = region.split(' ');
            const displayRegion = words[0] === words[1] ? words[0] : region;

            return (
              <span
                key={region}
                className="flex items-center gap-1 rounded-full bg-[#FF007A] pl-3 pr-2 py-1.5 text-[11px] font-semibold text-white"
              >
                {displayRegion}
                <button
                  type="button"
                  onClick={() => onToggleRegion(region)}
                  className="flex items-center justify-center ml-0.5"
                >
                  <FiX size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}