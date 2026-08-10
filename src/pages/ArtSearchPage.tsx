import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronLeft, FiSliders } from 'react-icons/fi';
import ArtCard from '../components/common/ArtCard';
import ArtFilterSheet, { type FilterState } from '../components/art_search/ArtFilterSheet';
import ArtSort, { type SortOption } from '../components/art_search/ArtSort';
import { type RecommendedCard, type CardSearchParams, authFetchCards } from '../data/card';
import { fetchDesignTags, type DesignTag } from '../data/designTag';

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

// 초기 20개, 추가 로드 시 10개씩 설정
const INITIAL_PAGE_SIZE = 20;
const NEXT_PAGE_SIZE = 10;

export default function ArtSearchPage() {
  const navigate = useNavigate();
  const [displayCards, setDisplayCards] = useState<RecommendedCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const [designTags, setDesignTags] = useState<DesignTag[]>([]);

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
    fetchDesignTags()
      .then((tags) => setDesignTags(Array.isArray(tags) ? tags : []))
      .catch((err) => console.error('디자인 태그 로드 실패:', err));
  }, []);

  const loadCards = useCallback(
    async (nextCursor?: string) => {
      setLoading(true);
      try {
        const isInitial = !nextCursor;

        let apiArtType: string | undefined = undefined;
        if (filters.artType === 'MONTHLY' || filters.artType === 'LAST_MONTHLY') {
          apiArtType = 'MONTHLY';
        } else if (filters.artType !== 'ALL' && filters.artType) {
          apiArtType = filters.artType;
        }

        const params: CardSearchParams = {
          regionIds: filters.regions.map((r) => r.id),
          designTagIds: filters.designs,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          artType: apiArtType,
          sort: SORT_PARAM_MAP[selectedSort],
          cursor: nextCursor,
          size: isInitial ? INITIAL_PAGE_SIZE : NEXT_PAGE_SIZE,
        };

        const result = await authFetchCards(params);

        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, '0')}`;

        let filtered = result.cards;

        if (filters.artType === 'MONTHLY') {
          filtered = result.cards.filter(
            (card) =>
              card.createdMonth && card.createdMonth.startsWith(currentYearMonth)
          );
        } else if (filters.artType === 'LAST_MONTHLY') {
          filtered = result.cards.filter(
            (card) =>
              card.createdMonth &&
              card.createdMonth.substring(0, 7) < currentYearMonth
          );
        }

        setDisplayCards((prev) => (isInitial ? filtered : [...prev, ...filtered]));

        if (isInitial) {
          setTotalCount(filtered.length);
        }

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

  // 초기 및 필터/정렬 변경 시 첫 페이지(20개) 조회
  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // 스크롤 80% 도달 시 추가 데이터(10개) 로드
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasNext || !cursor) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // 스크롤 위치가 80% 이상 도달했는지 확인
      if ((scrollTop + clientHeight) / scrollHeight >= 0.8) {
        loadCards(cursor);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasNext, cursor, loadCards]);

  const getSortLabel = () => {
    if (selectedSort === 'PRICE_LOW') return '가격 낮은 순';
    if (selectedSort === 'PRICE_HIGH') return '가격 높은 순';
    if (selectedSort === 'POPULAR') return '인기순';
    if (selectedSort === 'LATEST') return '최신순';
    return '추천순';
  };

  const getDesignFilterLabel = () => {
    if (filters.designs.length === 0) return '디자인';

    const firstTag = designTags.find(
      (tag) => tag.designTagId === filters.designs[0]
    );
    const firstName = firstTag ? firstTag.name : '디자인';

    if (filters.designs.length === 1) {
      return firstName;
    }

    return `${firstName} 외 ${filters.designs.length - 1}`;
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
            {getDesignFilterLabel()}
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
                createdMonth={card.createdMonth}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="py-20 text-center text-sm text-gray-400">
            조건에 맞는 아트가 없습니다.
          </div>
        ) : null}

        {loading && displayCards.length > 0 && (
          <div className="flex justify-center pt-12 pb-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF007A] border-t-transparent" />
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