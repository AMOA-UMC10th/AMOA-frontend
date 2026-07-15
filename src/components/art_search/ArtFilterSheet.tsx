import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type ArtType } from '../../data/nailData';

export interface FilterState {
  regions: string[];
  minPrice: number;   // 시안에 맞춰 최소 가격 추가
  maxPrice: number;
  artType: ArtType | 'ALL';
  designs: string[];
}

interface ArtFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  totalCount?: number; // 결과 개수를 동적으로 받기 위함 (시안: 300개 결과보기)
  onNavigateToLocationSearch?: () => void; // 위치 추가 클릭 시 위치 검색 페이지로 이동
}

const ART_TYPES = [
  { label: '전체', value: 'ALL' },
  { label: '이달의 아트', value: 'MONTHLY' },
  { label: '지난달 아트', value: 'LAST_MONTHLY' },
  { label: '이벤트 아트', value: 'EVENT' },
  { label: '원컬러', value: 'ONE_COLOR' },
];

const DESIGN_STYLES = ['심플', '아기자기', '화려', '스트릿', '유니크', '내추럴', '빈티지'];

export default function ArtFilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
  totalCount = 300,
  onNavigateToLocationSearch,
}: ArtFilterSheetProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  // 아트 유형 변경
  const handleArtTypeChange = (type: string) => {
    setTempFilters((prev) => ({ ...prev, artType: type as ArtType | 'ALL' }));
  };

  // 디자인 토글
  const handleToggleDesign = (design: string) => {
    setTempFilters((prev) => {
      const isExist = prev.designs.includes(design);
      return {
        ...prev,
        designs: isExist ? prev.designs.filter((d) => d !== design) : [...prev.designs, design],
      };
    });
  };

  // 디자인 '전체' 클릭 시 초기화
  const handleResetDesign = () => {
    setTempFilters((prev) => ({ ...prev, designs: [] }));
  };

  return createPortal(
    // 전체 화면을 덮는 필터 페이지 (바텀시트 X, 오버레이/둥근 모서리 없이 풀스크린)
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* 헤더 (필터 타이틀 & X 닫기 아이콘) */}
      <div className="relative flex items-center justify-center px-6 py-5 border-b border-[#f1f3f5] shrink-0">
        <h2 className="text-base font-bold text-[#1d2026]">필터</h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 text-2xl font-light text-[#1d2026] hover:opacity-70 focus:outline-none"
          aria-label="닫기"
        >
          &times;
        </button>
      </div>

      {/* 스크롤 가능한 필터 내용 */}
      <div className="flex-1 overflow-y-auto px-6 space-y-7 py-5 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* 1. 위치 섹션 */}
          <div className="border-b border-[#f1f3f5] pb-6">
            <h3 className="text-sm font-bold text-[#1d2026] mb-3">위치</h3>
            <button
              type="button"
              onClick={onNavigateToLocationSearch}
              className="w-full flex items-center justify-between border border-[#ced4da] rounded-xl px-4 py-3.5 text-sm text-[#1d2026] hover:bg-gray-50 transition-colors"
            >
              <span className={tempFilters.regions.length > 0 ? 'text-[#1d2026]' : 'text-[#adb5bd]'}>
                {tempFilters.regions.length > 0 ? tempFilters.regions.join(', ') : '위치 추가'}
              </span>
              <svg className="w-5 h-5 text-[#adb5bd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 2. 가격 섹션 (슬라이더 및 입력 필드) */}
          <div className="border-b border-[#f1f3f5] pb-6">
            <h3 className="text-sm font-bold text-[#1d2026] mb-3">가격</h3>
            <div className="flex items-center space-x-2.5 mb-5">
              <div className="flex-1 border border-[#ced4da] rounded-xl px-4 py-3 text-center">
                <span className="text-sm text-[#868e96] font-medium">
                  {tempFilters.minPrice.toLocaleString()}원
                </span>
              </div>
              <span className="text-[#868e96]">—</span>
              <div className="flex-1 border border-[#ced4da] rounded-xl px-4 py-3 text-center">
                <span className="text-sm text-[#868e96] font-medium">
                  {tempFilters.maxPrice.toLocaleString()}원
                </span>
              </div>
            </div>
            
            {/* 시안 커스텀 슬라이더 바 (단순 UI 구현) */}
            <div className="relative pt-2 px-1">
              <div className="h-1 bg-[#e9ecef] rounded-full w-full"></div>
              <div className="absolute top-2 left-[25%] right-[30%] h-1 bg-[#FF007A]"></div>
              <div className="absolute top-0.5 left-[25%] w-4 h-4 rounded-full bg-[#FF007A] shadow cursor-pointer"></div>
              <div className="absolute top-0.5 right-[30%] w-4 h-4 rounded-full bg-[#FF007A] shadow cursor-pointer"></div>
            </div>
          </div>

          {/* 3. 아트 유형 섹션 */}
          <div className="border-b border-[#f1f3f5] pb-6">
            <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">아트</h3>
            <div className="flex flex-wrap gap-2">
              {ART_TYPES.map((type) => {
                const isSelected = tempFilters.artType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleArtTypeChange(type.value)}
                    className={`rounded-full px-4 py-2.5 text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                        : 'border-[#ced4da] bg-white text-[#495057] hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 디자인 섹션 */}
          <div className="pb-6">
            <h3 className="text-sm font-bold text-[#1d2026] mb-3.5">디자인</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResetDesign}
                className={`rounded-full px-4 py-2.5 text-xs font-medium border transition-all ${
                  tempFilters.designs.length === 0
                    ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                    : 'border-[#ced4da] bg-white text-[#495057] hover:bg-gray-50'
                }`}
              >
                전체
              </button>
              {DESIGN_STYLES.map((design) => {
                const isSelected = tempFilters.designs.includes(design);
                return (
                  <button
                    key={design}
                    type="button"
                    onClick={() => handleToggleDesign(design)}
                    className={`rounded-full px-4 py-2.5 text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                        : 'border-[#ced4da] bg-white text-[#495057] hover:bg-gray-50'
                    }`}
                  >
                    {design}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      {/* 하단 고정 결과보기 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-6 pt-2 border-t border-transparent">
        <button
          type="button"
          onClick={() => {
            onApply(tempFilters);
            onClose();
          }}
          className="w-full rounded-2xl bg-[#adb5bd] py-4 text-center text-sm font-bold text-white hover:bg-[#969faf] transition-colors"
        >
          {totalCount}개 결과보기
        </button>
      </div>

    </div>,
    document.body
  );
}