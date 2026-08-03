import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, HeartIcon } from '../assets/icons';
import { FiChevronDown } from 'react-icons/fi';
import WishArtCard from '../components/wish_list/WishArtCard';
import WishShopCard from '../components/wish_list/WishShopCard';
import {
  getLikedCards,
  getLikedShops,
  type LikeSortType,
  type LikedCard,
  type LikedShop,
} from '../data/likeList';
import { markCardsLiked, markShopsLiked } from '../data/likeStore';

type WishTab = 'ART' | 'SHOP';
type SortOption =
  | 'RECOMMEND'
  | 'POPULAR'
  | 'LATEST'
  | 'PRICE_LOW'
  | 'PRICE_HIGH';

// 샵 상세의 아트 정렬(ShopArtList)과 같은 구성으로 맞춘다.
const SORT_LABEL: Record<SortOption, string> = {
  RECOMMEND: '추천순',
  POPULAR: '인기순',
  LATEST: '최신순',
  PRICE_LOW: '가격 낮은 순',
  PRICE_HIGH: '가격 높은 순',
};

const SORT_TYPE: Record<SortOption, LikeSortType> = {
  RECOMMEND: 'RECOMMENDED',
  POPULAR: 'POPULAR',
  LATEST: 'LATEST',
  PRICE_LOW: 'PRICE_ASC',
  PRICE_HIGH: 'PRICE_DESC',
};

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFEEF6]">
        <HeartIcon className="h-7 w-7 text-[#F70071]" filled />
      </span>
      <p className="mt-3 text-sm font-bold text-[#171B1C]">{title}</p>
      <p className="text-xs text-[#ADB0B5]">{subtitle}</p>
    </div>
  );
}

export default function WishListPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem('accessToken'))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('accessToken')));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [tab, setTab] = useState<WishTab>('ART');
  const [artSort, setArtSort] = useState<SortOption>('RECOMMEND');
  const [shopSort, setShopSort] = useState<SortOption>('LATEST');
  const [sortOpen, setSortOpen] = useState(false);

  const [cards, setCards] = useState<LikedCard[]>([]);
  const [shops, setShops] = useState<LikedShop[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [totalShops, setTotalShops] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [toastFading, setToastFading] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const fade = setTimeout(() => setToastFading(true), 1300);
    const hide = setTimeout(() => setToast(null), 1800);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, [toast]);

  function showRemovedToast() {
    setToastFading(false);
    setToast('찜 목록에서 삭제되었어요');
  }

  const sort = tab === 'ART' ? artSort : shopSort;
  const setSort = tab === 'ART' ? setArtSort : setShopSort;

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      if (tab === 'ART') {
        const result = await getLikedCards(SORT_TYPE[artSort]);
        setCards(result.cards);
        setTotalCards(result.totalCount);
        // 여기 있는 아트는 전부 찜한 것이므로 상세 화면에서도 하트가 켜지도록 알려둔다.
        markCardsLiked(result.cards.map((card) => card.cardId));
      } else {
        const result = await getLikedShops(SORT_TYPE[shopSort]);
        setShops(result.likedShops);
        setTotalShops(result.totalElements);
        markShopsLiked(result.likedShops.map((shop) => shop.shopId));
      }
    } catch (err) {
      console.error(err);
      setLoadError('찜 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [tab, artSort, shopSort, isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  function handleArtUnlike(cardId: number) {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
    setTotalCards((prev) => Math.max(0, prev - 1));
    showRemovedToast();
  }

  function handleShopUnlike(shopId: number) {
    setShops((prev) => prev.filter((s) => s.shopId !== shopId));
    setTotalShops((prev) => Math.max(0, prev - 1));
    showRemovedToast();
  }

  const isEmpty = tab === 'ART' ? cards.length === 0 : shops.length === 0;

  return (
    <main className="min-h-dvh bg-white pb-24">
      <header className="relative flex h-[72px] items-center justify-center border-b border-[#eceef1] px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">찜</h1>
      </header>

      <div className="flex border-b border-[#eceef1]">
        <button
          type="button"
          onClick={() => setTab('ART')}
          className={`h-12 flex-1 border-b-2 text-[13px] font-semibold ${
            tab === 'ART'
              ? 'border-[#F70071] text-black'
              : 'border-transparent text-[#ADB0B5]'
          }`}
        >
          아트
        </button>
        <button
          type="button"
          onClick={() => setTab('SHOP')}
          className={`h-12 flex-1 border-b-2 text-[13px] font-semibold ${
            tab === 'SHOP'
              ? 'border-[#F70071] text-black'
              : 'border-transparent text-[#ADB0B5]'
          }`}
        >
          샵
        </button>
      </div>

      <section className="pt-5">
        <div className="mb-5 flex items-center justify-between px-4 text-xs text-[#646F7C]">
          <span>
            {tab === 'ART' ? `아트 ${totalCards}개` : `샵 ${totalShops}개`}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((value) => !value)}
              className="flex items-center gap-1 font-semibold"
            >
              {SORT_LABEL[sort]} <FiChevronDown />
            </button>
            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-6 z-20 w-32 rounded-lg border border-[#eceef1] bg-white py-1 text-center shadow-lg">
                  {(Object.keys(SORT_LABEL) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                      className={`block w-full py-2.5 text-xs ${
                        option === sort
                          ? 'font-bold text-[#F70071]'
                          : 'text-gray-600'
                      }`}
                    >
                      {SORT_LABEL[option]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {isLoading && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">
            불러오는 중...
          </p>
        )}

        {!isLoading && !isLoggedIn && (
          <EmptyState
            title="로그인을 해주세요"
            subtitle="로그인 후 이용 가능한 서비스입니다."
          />
        )}

        {!isLoading && isLoggedIn && loadError && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">{loadError}</p>
        )}

        {!isLoading && isLoggedIn && !loadError && isEmpty && (
          <EmptyState
            title={
              tab === 'ART' ? '아트 찜 내역이 없어요' : '샵 찜 내역이 없어요'
            }
            subtitle={
              tab === 'ART'
                ? '마음에 드는 아트를 지금 저장해보세요'
                : '마음에 드는 샵을 지금 저장해보세요'
            }
          />
        )}

        {!isLoading && isLoggedIn && !loadError && !isEmpty && tab === 'ART' && (
          <div className="grid grid-cols-2 gap-0.5 gap-y-5">
            {cards.map((card) => (
              <WishArtCard
                key={card.cardId}
                card={card}
                onUnlike={handleArtUnlike}
              />
            ))}
          </div>
        )}

        {!isLoading && isLoggedIn && !loadError && !isEmpty && tab === 'SHOP' && (
          <div className="flex flex-col gap-6">
            {shops.map((shop) => (
              <WishShopCard
                key={shop.shopId}
                shop={shop}
                onUnlike={handleShopUnlike}
              />
            ))}
          </div>
        )}
      </section>

      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#171B1C] px-4 py-2 text-sm text-white shadow-lg transition-opacity duration-500 ease-out ${
            toastFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {toast}
        </div>
      )}
    </main>
  );
}