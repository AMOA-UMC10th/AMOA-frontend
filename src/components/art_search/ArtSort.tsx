// B102 아트 목록 정렬(drop down)

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

  const SORT_ITEMS: { label: string; value: SortOption }[] = [
    { label: '추천순', value: 'RECOMMEND' },
    { label: '가격 낮은 순', value: 'PRICE_LOW' },
    { label: '가격 높은 순', value: 'PRICE_HIGH' },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/0" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
      />

      <div 
        className="absolute right-0 top-9 z-50 w-32 rounded-xl border border-[#eceef1] bg-white py-1.5 shadow-lg"
        onClick={(e) => e.stopPropagation()} 
      >
        <ul className="flex flex-col">
          {SORT_ITEMS.map((item) => {
            const isSelected = selectedSort === item.value;
            return (
              <li key={item.value} className="w-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onSelectSort(item.value);
                    onClose();
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