import { useState } from 'react';
import ArtCard from '../common/ArtCard';
import type { ShopCardItem } from '../../data/shop';

export type SortOption = 'RECOMMEND' | 'POPULAR' | 'LATEST' | 'PRICE_LOW' | 'PRICE_HIGH';

interface ShopArtListProps {
  cards: ShopCardItem[];
  totalCount: number;
  shopName?: string;
  onFilterChange?: (artType: string) => void;
  onSortChange?: (sort: SortOption) => void;
}

export default function ShopArtList({
  cards,
  totalCount,
  shopName = '',
  onFilterChange,
  onSortChange,
}: ShopArtListProps) {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('LATEST');

  const filters = ['전체', '이달아', '이벤트', '원컬러'];

  const SORT_ITEMS: { label: string; value: SortOption }[] = [
    { label: '추천순', value: 'RECOMMEND' },
    { label: '인기순', value: 'POPULAR' },
    { label: '최신순', value: 'LATEST' },
    { label: '가격 낮은 순', value: 'PRICE_LOW' },
    { label: '가격 높은 순', value: 'PRICE_HIGH' },
  ];

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleSortClick = (sort: SortOption) => {
    setSelectedSort(sort);
    setIsSortOpen(false);
    onSortChange?.(sort);
  };

  const currentSortLabel = SORT_ITEMS.find((item) => item.value === selectedSort)?.label || '최신순';

  return (
    <div className="w-full bg-white pt-4 pb-20">
      <div className="px-5 flex gap-2 overflow-x-auto scrollbar-hide pb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4.5 py-2 rounded-full text-xs transition-colors border whitespace-nowrap ${
              activeFilter === filter
                ? 'bg-[#FF007A] text-white border-[#FF007A]'
                : 'bg-white text-[#646F7C] border-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="px-5 flex items-center justify-between my-3 relative">
        <p className="text-xs text-[#28323C]">아트 {totalCount}개</p>

        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="text-xs text-[#646F7C] flex items-center gap-0.5 font-medium"
          >
            {currentSortLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/0"
                onClick={() => setIsSortOpen(false)}
              />

              <div className="absolute right-0 top-6 z-50 w-32 rounded-xl border border-[#eceef1] bg-white py-1.5 shadow-lg">
                <ul className="flex flex-col">
                  {SORT_ITEMS.map((item) => {
                    const isSelected = selectedSort === item.value;
                    return (
                      <li key={item.value} className="w-full">
                        <button
                          type="button"
                          onClick={() => handleSortClick(item.value)}
                          className={`w-full px-4 py-2.5 text-left text-xs transition-colors ${
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-0.5 gap-y-6">
        {cards.map((card) => (
          <ArtCard
            key={card.cardId}
            cardId={card.cardId}
            instagramUrl={card.instagramUrl || ''}
            shopName={shopName}
            regionName={card.regionName}
            minPrice={card.minPrice}
            maxPrice={card.maxPrice}
            artType={card.artType}
            isLiked={card.isLiked}
          />
        ))}
      </div>
    </div>
  );
}