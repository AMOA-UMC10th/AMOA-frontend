//B102 아트 목록 정렬(drop down)


import React from 'react';

// 정렬 옵션 타입 정의
export type SortOption = 'RECOMMEND' | 'PRICE_LOW' | 'PRICE_HIGH';

interface ArtSortProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export default function ArtSort({
  isOpen,
  onClose,
  selectedSort,
  onSelectSort,
}: ArtSortProps) {
  if (!isOpen) return null;

  // 정렬 아이템 배열
  const SORT_ITEMS: { label: string; value: SortOption }[] = [
    { label: '추천순', value: 'RECOMMEND' },
    { label: '가격 낮은 순', value: 'PRICE_LOW' },
    { label: '가격 높은 순', value: 'PRICE_HIGH' },
  ];

  return (
    <>
      {/* 바깥 영역을 누르면 드롭다운이 닫히도록 투명 배경 레이어 배치 */}
      <div className="fixed inset-0 z-20" onClick={onClose} />

      {/* 정렬 메뉴 컨테이너 */}
      <div className="absolute right-0 top-7 z-30 w-32 rounded-xl border border-[#eceef1] bg-white py-1.5 shadow-lg">
        <ul className="flex flex-col">
          {SORT_ITEMS.map((item) => {
            const isSelected = selectedSort === item.value;
            return (
              <li key={item.value}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSort(item.value);
                    onClose(); // 선택 후 드롭다운 닫기
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#FFF0F6] text-[#FF007A]'
                      : 'text-[#56606d] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}