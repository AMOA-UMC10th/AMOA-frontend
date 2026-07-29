// [E102, E104] 찜 목록 화면 (아트 탭 / 샵 탭)
//
// 설계서:
// - 아트 찜과 샵 찜은 서버에서 별개로 관리된다. 아트를 찜해도 그 샵이 찜되지는 않는다.
// - 재탭 시 해제 → 하트 상태 변경(애니메이션) + 토스트 → 목록에서 삭제
//   (하트 상태·토스트·API 호출은 각 카드의 찜 버튼이 담당하고, 이 화면은 목록에서 빼는 일만 한다)
// - 찜한 항목이 1건도 없으면 빈 상태 화면, 1건 이상 생기면 즉시 목록 형태로 전환

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
import { unlikeShop } from '../data/like';

type WishTab = 'ART' | 'SHOP';
type SortOption = 'RECOMMEND' | 'LATEST';

const SORT_LABEL: Record<SortOption, string> = {
  RECOMMEND: '추천순',
  LATEST: '최신순',
};

// 화면의 정렬 선택을 서버 sortType으로 옮긴다. 정렬은 서버가 처리한다.
const SORT_TO_API: Record<SortOption, LikeSortType> = {
  RECOMMEND: 'RECOMMENDED',
  LATEST: 'LATEST',
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center pt-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFEEF6]">
        <HeartIcon className="h-6 w-6 text-[#F70071]" filled />
      </span>
      <p className="mt-4 text-sm font-semibold text-[#171B1C]">{message}</p>
      <p className="mt-1.5 text-[13px] text-[#ADB0B5]">
        마음에 드는 곳을 찜해보세요
      </p>
    </div>
  );
}

export default function WishListPage() {
  const navigate = useNavigate();

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

  // 해제 토스트는 이 화면이 직접 띄운다.
  // 하트 버튼 안에도 토스트가 있지만, 해제하면 카드가 목록에서 빠지면서
  // 버튼째 언마운트돼 토스트가 보이기 전에 사라진다.
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(
    null,
  );
  const [toastFading, setToastFading] = useState(false);

  useEffect(() => {
    if (!toast) return;

    const fadeTimer = setTimeout(() => setToastFading(true), 1300);
    const hideTimer = setTimeout(() => setToast(null), 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [toast]);

  function showToast(message: string, error = false) {
    setToastFading(false);
    setToast({ message, error });
  }

  const sort = tab === 'ART' ? artSort : shopSort;
  const setSort = tab === 'ART' ? setArtSort : setShopSort;

  // 탭이나 정렬이 바뀌면 해당 탭의 목록만 다시 받는다.
  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      if (tab === 'ART') {
        const result = await getLikedCards({ sortType: SORT_TO_API[artSort] });
        setCards(result.cards);
        setTotalCards(result.totalCount);
      } else {
        const result = await getLikedShops({ sortType: SORT_TO_API[shopSort] });
        setShops(result.likedShops);
        setTotalShops(result.totalElements);
      }
    } catch (err) {
      console.error(err);
      setLoadError('찜 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [tab, artSort, shopSort]);

  useEffect(() => {
    void load();
  }, [load]);

  // 아트는 ArtLikeBtn이 이미 서버에 요청을 보내고 실패 시 하트를 되돌린다.
  // 여기서는 목록에서 빼기만 하고, 되돌아온 경우(다시 찜됨)에는 목록을 새로 받는다.
  function handleArtLikeChange(cardId: number, liked: boolean) {
    if (liked) {
      void load();
      return;
    }
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
    setTotalCards((prev) => Math.max(0, prev - 1));
    showToast('찜 목록에서 삭제되었어요');
  }

  // 샵 찜 해제는 이 화면이 직접 요청한다.
  // 먼저 목록에서 빼고, 실패하면 되돌려 실제 데이터와 어긋나지 않게 한다.
  async function handleShopUnlike(shopId: number) {
    const previous = shops;
    const previousTotal = totalShops;

    setShops((prev) => prev.filter((s) => s.shopId !== shopId));
    setTotalShops((prev) => Math.max(0, prev - 1));

    try {
      await unlikeShop(shopId);
      showToast('찜 목록에서 삭제되었어요');
    } catch (err) {
      console.error(err);
      setShops(previous);
      setTotalShops(previousTotal);
      showToast('찜 해제에 실패했어요', true);
    }
  }

  const count = tab === 'ART' ? totalCards : totalShops;
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
          <span>{tab === 'ART' ? `아트 ${count}개` : `샵 ${count}개`}</span>

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
                <div className="absolute right-0 top-6 z-20 w-24 rounded-lg border border-[#eceef1] bg-white py-1 text-center shadow-lg">
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

        {!isLoading && loadError && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">{loadError}</p>
        )}

        {!isLoading && !loadError && isEmpty && (
          <EmptyState
            message={tab === 'ART' ? '찜한 아트가 없어요' : '찜한 샵이 없어요'}
          />
        )}

        {!isLoading && !loadError && !isEmpty && tab === 'ART' && (
          <div className="grid grid-cols-2 gap-0.5 gap-y-5">
            {cards.map((card) => (
              <WishArtCard
                key={card.cardId}
                card={card}
                onUnlike={(cardId) => handleArtLikeChange(cardId, false)}
              />
            ))}
          </div>
        )}

        {!isLoading && !loadError && !isEmpty && tab === 'SHOP' && (
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

      {/* 하단 탭바에 가리지 않도록 그 위에 띄운다. */}
      {toast && (
        <div
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-sm text-white shadow-lg transition-opacity duration-500 ease-out ${
            toast.error ? 'bg-[#F70071]' : 'bg-[#171B1C]'
          } ${toastFading ? 'opacity-0' : 'opacity-100'}`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}
