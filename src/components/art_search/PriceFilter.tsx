import React, { useRef } from 'react';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onChangePrice: (min: number, max: number) => void;
}

const MIN_LIMIT = 0;
const MAX_LIMIT = 200000;
const STEP = 1000;

export default function PriceFilter({
  minPrice,
  maxPrice,
  onChangePrice,
}: PriceFilterProps) {
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // 최소 가격 직접 입력 시 호출
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
    const numValue = value === '' ? 0 : Number(value);
    
    // 최대 가격을 넘지 않도록 제어하며 부모 상태 업데이트
    const safeMin = Math.min(numValue, maxPrice);
    onChangePrice(safeMin, maxPrice);
  };

  // 최대 가격 직접 입력 시 호출
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
    const numValue = value === '' ? 0 : Number(value);

    // 전체 제한 한도(20만 원)를 넘지 않도록 제어
    const safeMax = Math.min(numValue, MAX_LIMIT);
    onChangePrice(minPrice, safeMax);
  };

  // 슬라이더 바 조절 시 호출
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, isMax: boolean) => {
    const value = Number(e.target.value);
    if (isMax) {
      const safeValue = Math.max(value, minPrice);
      onChangePrice(minPrice, safeValue);
    } else {
      const safeValue = Math.min(value, maxPrice);
      onChangePrice(safeValue, maxPrice);
    }
  };

  const minPercent = ((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;
  const maxPercent = ((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;

  const inputStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    width: '100%',
    position: 'absolute',
    background: 'transparent',
    pointerEvents: 'none',
    outline: 'none',
    margin: 0,
    padding: 0,
    height: '18px', // Thumb 크기와 맞춰 찌그러짐 원천 방지
    top: '50%',
    transform: 'translateY(-50%)',
  };

  return (
    <div className="py-2">
      <style>{`
        .range-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff !important;
          border: 2px solid #FF007A !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          pointer-events: auto;
          margin-top: 0 !important; 
        }
        .range-slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ffffff !important;
          border: 2px solid #FF007A !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>

      <h3 className="text-sm font-bold text-[#1d2026] mb-3">가격</h3>
      
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="flex-1 flex items-center border border-[#ced4da] focus-within:border-[#FF007A] rounded-xl px-3 py-2.5 bg-white">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minPrice === 0 ? '' : minPrice}
            placeholder="0"
            onChange={handleMinInputChange}
            className="w-full text-center text-sm text-[#28323c] font-semibold outline-none bg-transparent"
          />
          <span className="text-xs text-[#868e96] ml-1 font-semibold">원</span>
        </div>

        <span className="text-[#868e96]">—</span>

        <div className="flex-1 flex items-center border border-[#ced4da] focus-within:border-[#FF007A] rounded-xl px-3 py-2.5 bg-white">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxPrice === 0 ? '' : maxPrice}
            placeholder="200,000"
            onChange={handleMaxInputChange}
            className="w-full text-center text-sm text-[#28323c] font-semibold outline-none bg-transparent"
          />
          <span className="text-xs text-[#868e96] ml-1 font-semibold">원</span>
        </div>
      </div>
      
          <div className="relative w-full h-6 flex items-center" style={{ paddingLeft: 9, paddingRight: 9 }}>
            <div 
              ref={sliderTrackRef}
              className="absolute left-[9px] right-[9px] h-[5px] bg-[#e9ecef] rounded-full z-10 pointer-events-none"
            />
            
            <div 
              className="absolute h-[5px] bg-[#FF007A] rounded-full z-20 pointer-events-none"
              style={{
                left: `calc(9px + ${minPercent}% * (100% - 18px) / 100%)`,
                right: `calc(9px + ${100 - maxPercent}% * (100% - 18px) / 100%)`
              }}
            />

            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={minPrice}
              onChange={(e) => handleSliderChange(e, false)}
              className="range-slider-input z-30"
              style={{ ...inputStyle, width: 'calc(100% - 18px)', left: 9 }}
            />
            
            <input
              type="range"
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              step={STEP}
              value={maxPrice}
              onChange={(e) => handleSliderChange(e, true)}
              className="range-slider-input z-30"
              style={{ ...inputStyle, width: 'calc(100% - 18px)', left: 9 }}
            />
          </div>
    </div>
  );
}