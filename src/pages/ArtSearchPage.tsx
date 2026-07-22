import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronLeft, FiSliders } from 'react-icons/fi';
import { mockCardResponse, type NailCard } from '../data/nailData';
import ArtCard from '../components/common/ArtCard';
import ArtFilterSheet, { type FilterState } from '../components/art_search/ArtFilterSheet';
import ArtSort, { type SortOption } from '../components/art_search/ArtSort';

const ART_TYPE_LABELS: Record<string, string> = {
  MONTHLY: '이달의 아트',
  LAST_MONTHLY: '지난달 아트',
  EVENT: '이벤트 아트',
  ONE_COLOR: '원컬러',
};

export default function ArtSearchPage() {
  const navigate = useNavigate();
  const [displayCards, setDisplayCards] = useState<NailCard[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('RECOMMEND');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    minPrice: 30000,
    maxPrice: 100000,
    artType: 'ALL',
    designs: [],
  });

  useEffect(() => {
    let updatedCards = [...mockCardResponse.result.cards];

    if (filters.regions.length > 0) {
      updatedCards = updatedCards.filter((card) =>
        filters.regions.includes(card.region_name)
      );
    }

    updatedCards = updatedCards.filter((card) => {
      return card.max_price >= filters.minPrice && card.min_price <= filters.maxPrice;
    });

    if (filters.artType !== 'ALL') {
      updatedCards = updatedCards.filter((card) => card.art_type === filters.artType);
    }

    if (selectedSort === 'PRICE_LOW') {
      updatedCards.sort((a, b) => a.min_price - b.min_price);
    } else if (selectedSort === 'PRICE_HIGH') {
      updatedCards.sort((a, b) => b.max_price - a.max_price);
    } else if (selectedSort === 'POPULAR') {
      updatedCards.sort((a, b) => (b.is_liked ? 1 : 0) - (a.is_liked ? 1 : 0));
    } else if (selectedSort === 'LATEST') {
      updatedCards.sort((a, b) => b.created_month.localeCompare(a.created_month));
    } else {
      updatedCards.sort((a, b) => a.card_id - b.card_id);
    }

    setDisplayCards(updatedCards);
  }, [filters, selectedSort]);

  const getSortLabel = () => {
    if (selectedSort === 'PRICE_LOW') return '가격 낮은 순';
    if (selectedSort === 'PRICE_HIGH') return '가격 높은 순';
    if (selectedSort === 'POPULAR') return '인기순';
    if (selectedSort === 'LATEST') return '최신순';
    return '추천순';
  };

  return (
    <main className="min-h-dvh bg-white pb-24">
      <header className="relative flex h-[72px] items-center justify-center border-b border-[#eceef1] px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 text-[22px] text-[#687080]"
          aria-label="뒤로가기"
        >
          <FiChevronLeft />
        </button>
        <h1 className="text-sm font-semibold text-[#1d2026]">아트 찾기</h1>
      </header>

      <section className="overflow-x-auto border-b border-[#eceef1] px-4 py-3 [scrollbar-width:none]">
        <div className="flex w-max gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-10 items-center justify-center rounded-full border border-[#b7bec8] text-lg text-[#687080]"
            aria-label="필터"
          >
            <FiSliders />
          </button>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors ${
              filters.regions.length > 0
                ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                : 'border-[#b7bec8] text-[#56606d]'
            }`}
          >
            {filters.regions.length > 0 ? filters.regions.join(', ') : '위치'}
            <FiChevronDown />
          </button>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors ${
              filters.minPrice !== 30000 || filters.maxPrice !== 100000
                ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                : 'border-[#b7bec8] text-[#56606d]'
            }`}
          >
            {filters.minPrice !== 30000 || filters.maxPrice !== 100000
              ? `${(filters.minPrice / 10000).toFixed(0)}~${(filters.maxPrice / 10000).toFixed(0)}만원`
              : '가격'}
            <FiChevronDown />
          </button>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors ${
              filters.artType !== 'ALL'
                ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                : 'border-[#b7bec8] text-[#56606d]'
            }`}
          >
            {filters.artType !== 'ALL' ? (ART_TYPE_LABELS[filters.artType] ?? '아트') : '아트'}
            <FiChevronDown />
          </button>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-medium transition-colors ${
              filters.designs.length > 0
                ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                : 'border-[#b7bec8] text-[#56606d]'
            }`}
          >
            {filters.designs.length > 0
              ? filters.designs.length === 1
                ? filters.designs[0]
                : `${filters.designs[0]} 외 ${filters.designs.length - 1}`
              : '디자인'}
            <FiChevronDown />
          </button>
        </div>
      </section>

      <section className="pt-5">
        <div className="px-5 mb-5 flex items-center justify-between text-xs text-[#727b88]">
          <span>검색결과 {displayCards.length}개</span>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((value) => !value)}
              className="flex items-center gap- font-semibold"
            >
              {getSortLabel()} <FiChevronDown />
            </button>
            <ArtSort
              isOpen={sortOpen}
              onClose={() => setSortOpen(false)}
              selectedSort={selectedSort}
              onSelectSort={(sort) => setSelectedSort(sort)}
            />
          </div>
        </div>

        {displayCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-0.5 gap-y-5">
            {displayCards.map((card, index) => (
              <ArtCard 
                key={card.card_id || `search-card-${index}`}
                cardId={card.card_id}
                instagramUrl={card.instagram_url}
                shopName={card.shop_name}
                regionName={card.region_name}
                minPrice={card.min_price}
                maxPrice={card.max_price}
                artType={card.art_type}
                isLiked={card.is_liked}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-sm text-gray-400">
            조건에 맞는 아트가 없습니다.
          </div>
        )}
      </section>

      <ArtFilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(updatedFilters) => setFilters(updatedFilters)}
        onNavigateToLocationSearch={() => navigate('/location-search')}
      />
    </main>
  );
}