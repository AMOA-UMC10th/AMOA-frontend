import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronLeft, FiSliders } from 'react-icons/fi';
import ArtCard from '../components/common/ArtCard';
import ArtFilterSheet, { type FilterState } from '../components/art_search/ArtFilterSheet';
import ArtSort, { type SortOption } from '../components/art_search/ArtSort';
import { type RecommendedCard, type CardSearchParams, fetchCards } from '../data/card';

const ART_TYPE_LABELS: Record<string, string> = {
  MONTHLY: '이달의 아트',
  LAST_MONTHLY: '지난달 아트',
  EVENT: '이벤트 아트',
  ONE_COLOR: '원컬러',
};

const SORT_PARAM_MAP: Record<SortOption, string | undefined> = {
  RECOMMEND: undefined,
  POPULAR: 'POPULAR',
  LATEST: 'LATEST',
  PRICE_LOW: 'PRICE_ASC',
  PRICE_HIGH: 'PRICE_DESC',
};

const PAGE_SIZE = 20;

export default function ArtSearchPage() {
  const navigate = useNavigate();
  const [displayCards, setDisplayCards] = useState<RecommendedCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const loadCards = useCallback(
    async (nextCursor?: string) => {
      setLoading(true);
      try {
        const params: CardSearchParams = {
          regionIds: filters.regions.map((r) => r.id),
          designTagIds: filters.designs,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          artType: filters.artType !== 'ALL' && filters.artType ? filters.artType : undefined,
          sort: SORT_PARAM_MAP[selectedSort],
          cursor: nextCursor,
          size: PAGE_SIZE,
        };

        const result = await fetchCards(params);

        setDisplayCards((prev) => {
          const updatedCards = nextCursor ? [...prev, ...result.cards] : result.cards;
          // 필터링 적용 후 실제 화면에 보여지는 카드 개수 업데이트
          setTotalCount(updatedCards.length);
          return updatedCards;
        });

        setCursor(result.nextCursor);
        setHasNext(result.hasNext);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters, selectedSort]
  );

  useEffect(() => {
    loadCards();
  }, [loadCards]);

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
            {filters.regions.length > 0
              ? filters.regions.length === 1
                ? filters.regions[0].label
                : `${filters.regions[0].label} 외 ${filters.regions.length - 1}`
              : '위치'}
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
              filters.artType !== 'ALL' && filters.artType
                ? 'border-transparent bg-[#FF007A] text-white font-semibold'
                : 'border-[#b7bec8] text-[#56606d]'
            }`}
          >
            {filters.artType !== 'ALL' && filters.artType
              ? (ART_TYPE_LABELS[filters.artType] ?? '아트')
              : '아트'}
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
            {filters.designs.length > 0 ? `디자인 ${filters.designs.length}` : '디자인'}
            <FiChevronDown />
          </button>
        </div>
      </section>

      <section className="pt-5">
        <div className="px-5 mb-5 flex items-center justify-between text-xs text-[#727b88]">
          <span>검색결과 {totalCount}개</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((value) => !value)}
              className="flex items-center gap-1 font-semibold"
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
                key={card.cardId || `search-card-${index}`}
                cardId={card.cardId}
                instagramUrl={card.instagramUrl}
                shopName={card.shopName}
                regionName={card.regionName}
                minPrice={card.minPrice}
                maxPrice={card.maxPrice}
                artType={card.artType}
                isLiked={card.isLiked}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="py-20 text-center text-sm text-gray-400">
            조건에 맞는 아트가 없습니다.
          </div>
        ) : null}

        {hasNext && (
          <div className="flex justify-center py-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => cursor && loadCards(cursor)}
              className="rounded-full border border-[#eceef1] px-4 py-2 text-xs text-[#56606d]"
            >
              {loading ? '불러오는 중...' : '더보기'}
            </button>
          </div>
        )}
      </section>

      <ArtFilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(updatedFilters) => setFilters(updatedFilters)}
      />
    </main>
  );
}