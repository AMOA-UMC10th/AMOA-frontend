import React from 'react';

// 시안 이미지(image_7bd942.png)에 표시된 가격 필터 단락 범위 목록
const PRICE_OPTIONS = [
  { label: '3만원 이하', value: 30000 },
  { label: '5만원 이하', value: 50000 },
  { label: '7만원 이하', value: 70000 },
  { label: '10만원 이하', value: 100000 },
  { label: '무제한', value: 999999 }, // 제한 없음 표현을 위한 큰 값 설정
];

interface PriceFilterProps {
  maxPrice: number;
  onChangeMaxPrice: (price: number) => void;
}

export default function PriceFilter({
  maxPrice,
  onChangeMaxPrice,
}: PriceFilterProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-[#1d2026]">가격 범위</h3>
        <span className="text-[11px] text-gray-400">최대 금액 기준 선택</span>
      </div>

      {/* 시안의 그리드 형태 가격 칩 리스트 */}
      <div className="grid grid-cols-2 gap-2">
        {PRICE_OPTIONS.map((option) => {
          // 현재 선택된 가격 값과 옵션 값이 일치하는지 확인
          const isSelected = maxPrice === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChangeMaxPrice(option.value)}
              className={`rounded-xl py-3.5 text-xs font-semibold border transition-all text-center ${
                isSelected
                  ? 'border-[#FF007A] bg-[#FFF0F6] text-[#FF007A]'
                  : 'border-[#eceef1] bg-white text-[#56606d] hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}