import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronLeft, FiHeart, FiSliders } from 'react-icons/fi';
import { mockCardResponse, type NailCard } from '../data/nailData';
import InstagramSafeImage from '../components/common/InstagramSafeImage';

// 위치가 바뀐 art_search 폴더의 바텀 시트 임포트
import ArtFilterSheet, { type FilterState } from '../components/art_search/ArtFilterSheet';
// 정렬 드롭다운 컴포넌트 임포트
import ArtSort, { type SortOption } from '../components/art_search/ArtSort';

const ART_TYPE_LABELS: Record<string, string> = {
  MONTHLY: '이달의 아트',
  LAST_MONTHLY: '지난달 아트',
  EVENT: '이벤트 아트',
  ONE_COLOR: '원컬러',
};

function ArtCard({ card }: { card: NailCard }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/art/${card.card_id}`);
  };

  return (
    <article className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 pointer-events-none">
        <InstagramSafeImage url={card.instagram_url} />
      </div>

      <div className="relative pt-2">
        <span className="inline-flex rounded bg-[#FCE7F3] px-1.5 py-0.5 text-[10px] font-bold text-[#374553]">
          {card.created_month ? `${parseInt(card.created_month.split('-')[1], 10)}월 ` : ''}
          {card.art_type === 'EVENT' ? '이벤트' : '이달아'}
        </span>
        <button
          type="button"
          className="absolute right-0 top-2 text-[22px] text-[#15171b]"
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label="찜하기"
        >
          <FiHeart />
        </button>
        <h2 className="mt-1.5 truncate text-sm font-bold text-[#28323C]">
          {card.shop_name}
        </h2>
        <p className="mt-0.5 text-xs text-[#ADB0B5] flex items-center gap-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-6.5-7-11.5a7 7 0 1114 0C19 14.5 12 21 12 21z"
              stroke="#ADB0B5"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" stroke="#ADB0B5" strokeWidth="2" />
          </svg>
          {card.region_name}
        </p>
        <p className="mt-1 text-sm font-bold text-[#435b77]">
          {card.min_price?.toLocaleString()}~{card.max_price?.toLocaleString()}원
        </p>
      </div>
    </article>
  );
}

export default function ArtSearchPage() {
  const navigate = useNavigate();
  
  // 1. 화면에 최종 보여줄 카드를 위한 state 추가
  const [displayCards, setDisplayCards] = useState<NailCard[]>([]);

  // 정렬 순서 및 드롭다운 토글 상태 관리
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('RECOMMEND');

  // 필터 바텀시트 열림 여부
  const [filterOpen, setFilterOpen] = useState(false);
  
  // 필터 데이터 초기 상태
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    minPrice: 30000,
    maxPrice: 100000,
    artType: 'ALL',
    designs: [],
  });

  // 2. 필터 조건과 정렬 기준이 바뀔 때 데이터를 재정렬/필터링하는 핵심 로직 추가
  useEffect(() => {
    // 원본 데이터 복사
    let updatedCards = [...mockCardResponse.result.cards];

    // [A] 위치 필터링
    if (filters.regions.length > 0) {
      updatedCards = updatedCards.filter((card) =>
        filters.regions.includes(card.region_name)
      );
    }

    // [B] 가격 필터링 (최소 가격 ~ 최대 가격 범위)
    updatedCards = updatedCards.filter((card) => {
      return card.max_price >= filters.minPrice && card.min_price <= filters.maxPrice;
    });

    // [C] 아트 유형 필터링
    if (filters.artType !== 'ALL') {
      updatedCards = updatedCards.filter((card) => card.art_type === filters.artType);
    }

    // [D] 정렬 처리
    if (selectedSort === 'PRICE_LOW') {
      // 가격 낮은 순 (min_price 오름차순)
      updatedCards.sort((a, b) => a.min_price - b.min_price);
    } else if (selectedSort === 'PRICE_HIGH') {
      // 가격 높은 순 (max_price 내림차순)
      updatedCards.sort((a, b) => b.max_price - a.max_price);
    } else {
      // 추천순 (기본 card_id 순서 등 고유 로직 처리)
      updatedCards.sort((a, b) => a.card_id - b.card_id);
    }

    // 최종 변경 데이터를 상태에 세팅
    setDisplayCards(updatedCards);
  }, [filters, selectedSort]);

  // 정렬 텍스트 변환 헬퍼
  const getSortLabel = () => {
    if (selectedSort === 'PRICE_LOW') return '가격 낮은 순';
    if (selectedSort === 'PRICE_HIGH') return '가격 높은 순';
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
          {/* 필터 칩 클릭 시 전체 필터 바텀시트 열림 */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-10 items-center justify-center rounded-full border border-[#b7bec8] text-lg text-[#687080]"
            aria-label="필터"
          >
            <FiSliders />
          </button>

          {/* 위치 칩 */}
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

          {/* 가격 칩 */}
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

          {/* 아트 칩 */}
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

          {/* 디자인 칩 */}
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

      <section className="px-4 pt-5">
        <div className="mb-5 flex items-center justify-between text-xs text-[#727b88]">
          <span>검색결과 {displayCards.length}개</span>
          
          {/* 3. 드롭다운 이벤트 꼬임 방지를 위해 ArtSort 컴포넌트로 대체 연동 */}
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

        {/* 4. displayCards 상태 데이터 기반으로 화면 그리드 렌더링 */}
        {displayCards.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {displayCards.map((card, index) => (
              <ArtCard key={card.card_id || `search-card-${index}`} card={card} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-sm text-gray-400">
            조건에 맞는 아트가 없습니다.
          </div>
        )}
      </section>

      {/* 최종 조립된 통합 바텀 시트 연동 */}
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