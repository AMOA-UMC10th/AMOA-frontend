import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronLeft, FiHeart, FiSliders } from 'react-icons/fi';
import { mockCardResponse, type NailCard } from '../data/nailData';

// 위치가 바뀐 art_search 폴더의 바텀 시트 임포트
import ArtFilterSheet, { type FilterState } from '../components/art_search/ArtFilterSheet';

function InstagramSafeImage({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const targetWidth = 326; // 인스타 기본 최소 가로폭 기준
        if (width > 0) {
          setScale(width / targetWidth);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!url || url.trim() === '') {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100">
        이미지가 없습니다.
      </div>
    );
  }

  const cleanUrl = url.split('?')[0];
  const embedUrl = `${cleanUrl}${cleanUrl.endsWith('/') ? '' : '/'}embed/?captioned=false`;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#E9EBEE]">
      <div
        className="absolute origin-top-left"
        style={{
          width: '326px',
          height: '435px', // 3:4 세로 비율 유지 (326 * 4/3)
          transform: `scale(${scale})`,
          top: '0px',      // 자르지 않고 맨 위부터 보이도록 0px로 고정
          left: '0px',
        }}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 pointer-events-none"
          scrolling="no"
          title="Instagram Image"
          loading="lazy"
        />
      </div>
    </div>
  );
}

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
        <span className="inline-flex rounded bg-[#FCE7F3] px-1.5 py-0.5 text-[10px] font-bold text-[#FF007A]">
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
  
  // 정렬 순서 및 드롭다운 토글 상태 관리
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<'RECOMMEND' | 'PRICE_LOW' | 'PRICE_HIGH'>('RECOMMEND');

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

  const cards = mockCardResponse.result.cards;

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
          {['위치', '가격', '아트', '디자인'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex h-8 items-center gap-1 rounded-full border border-[#b7bec8] px-3 text-xs text-[#56606d]"
            >
              {filter}
              <FiChevronDown />
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="mb-5 flex items-center justify-between text-xs text-[#727b88]">
          <span>검색결과 {cards.length}개</span>
          
          {/* 정렬 드롭다운 컴포넌트 에러를 방지하기 위해 인라인 컴포넌트로 깔끔하게 처리 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((value) => !value)}
              className="flex items-center gap-1 font-semibold"
            >
              {getSortLabel()} <FiChevronDown />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-6 z-20 w-32 rounded-lg border border-[#eceef1] bg-white py-1 shadow-lg text-center">
                  <button
                    type="button"
                    onClick={() => { setSelectedSort('RECOMMEND'); setSortOpen(false); }}
                    className={`block w-full py-2.5 text-xs ${selectedSort === 'RECOMMEND' ? 'font-bold text-[#FF007A]' : 'text-gray-600'}`}
                  >
                    추천순
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedSort('PRICE_LOW'); setSortOpen(false); }}
                    className={`block w-full py-2.5 text-xs border-t border-gray-50 ${selectedSort === 'PRICE_LOW' ? 'font-bold text-[#FF007A]' : 'text-gray-600'}`}
                  >
                    가격 낮은 순
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedSort('PRICE_HIGH'); setSortOpen(false); }}
                    className={`block w-full py-2.5 text-xs border-t border-gray-50 ${selectedSort === 'PRICE_HIGH' ? 'font-bold text-[#FF007A]' : 'text-gray-600'}`}
                  >
                    가격 높은 순
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-7">
          {cards.map((card, index) => (
            <ArtCard key={card.card_id || `search-card-${index}`} card={card} />
          ))}
        </div>
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