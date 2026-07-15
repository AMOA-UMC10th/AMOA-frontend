import React from 'react';

// 시안 이미지(image_7c54e5.png)에 표시된 정확한 디자인 스타일 배열 순서
const DESIGN_STYLES = [
  '심플',
  '아기자기',
  '화려',
  '스트릿',
  '유니크',
  '내추럴',
  '빈티지',
];

interface DesignFilterProps {
  selectedDesigns: string[];
  onToggleDesign: (design: string) => void;
}

export default function DesignFilter({
  selectedDesigns,
  onToggleDesign,
}: DesignFilterProps) {
  const isAllSelected = selectedDesigns.length === 0;

  return (
    <div className="py-2">
      <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">디자인</h3>

      <div className="flex flex-wrap gap-2">
        {/* '전체' 칩 */}
        <button
          type="button"
          onClick={() => {
            // 모든 선택 해제하여 전체 선택 상태로 만듦
            if (!isAllSelected) {
              selectedDesigns.forEach((d) => onToggleDesign(d));
            }
          }}
          className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
            isAllSelected
              ? 'border-transparent bg-[#FF007A] text-white' // 핫핑크 배경 + 흰색 텍스트
              : 'border-[#eceef1] bg-white text-[#56606d] hover:bg-gray-50'
          }`}
        >
          전체
        </button>

        {/* 개별 디자인 스타일 칩 */}
        {DESIGN_STYLES.map((design) => {
          const isSelected = selectedDesigns.includes(design);
          return (
            <button
              key={design}
              type="button"
              onClick={() => onToggleDesign(design)}
              className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                isSelected
                  ? 'border-transparent bg-[#FF007A] text-white' // 핫핑크 배경 + 흰색 텍스트
                  : 'border-[#eceef1] bg-white text-[#56606d] hover:bg-gray-50'
              }`}
            >
              {design}
            </button>
          );
        })}
      </div>
    </div>
  );
}