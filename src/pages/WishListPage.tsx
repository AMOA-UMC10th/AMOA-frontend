// [E102, E104] 찜 목록 화면 (아트 탭 / 샵 탭 분기 및 리스트 노출)

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../assets/icons';
import { FiChevronDown } from 'react-icons/fi';
import WishArtCard from '../components/wish_list/WishArtCard';
import WishShopCard from '../components/wish_list/WishShopCard';
import { mockCardResponse, type NailCard } from '../data/mockupdata/nailData';

type WishTab = 'ART' | 'SHOP';
type SortOption = 'RECOMMEND' | 'LATEST';

const SORT_LABEL: Record<SortOption, string> = {
  RECOMMEND: '추천순',
  LATEST: '최신순',
};

// TODO: 샵 단위 찜 상태를 위한 실제 API 연동 전까지, 찜한 아트가 속한 샵을 찜한 샵으로 간주
function getLikedShopNames(cards: NailCard[]): string[] {
  return Array.from(new Set(cards.filter((c) => c.is_liked).map((c) => c.shop_name)));
}

export default function WishListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<WishTab>('ART');
  const [artSort, setArtSort] = useState<SortOption>('RECOMMEND');
  const [shopSort, setShopSort] = useState<SortOption>('LATEST');
  const [sortOpen, setSortOpen] = useState(false);

  const [likedCards, setLikedCards] = useState<NailCard[]>(() =>
    mockCardResponse.result.cards.filter((c) => c.is_liked),
  );
  const [likedShopNames, setLikedShopNames] = useState<string[]>(() =>
    getLikedShopNames(mockCardResponse.result.cards),
  );

  const handleArtUnlike = (cardId: number) => {
    setLikedCards((prev) => prev.filter((c) => c.card_id !== cardId));
  };

  const handleShopUnlike = (shopName: string) => {
    setLikedShopNames((prev) => prev.filter((name) => name !== shopName));
  };

  const sortedCards = useMemo(() => {
    if (artSort === 'RECOMMEND') return likedCards;
    return [...likedCards].sort((a, b) => b.card_id - a.card_id);
  }, [likedCards, artSort]);

  const shopGroups = useMemo(() => {
    const allCards = mockCardResponse.result.cards;
    const groups = likedShopNames.map((shopName) => {
      const arts = allCards.filter((c) => c.shop_name === shopName);
      return {
        shopName,
        region: arts[0]?.region_name ?? '',
        arts,
        latestCardId: Math.max(...arts.map((c) => c.card_id), 0),
      };
    });

    if (shopSort === 'RECOMMEND') return groups;
    return [...groups].sort((a, b) => b.latestCardId - a.latestCardId);
  }, [likedShopNames, shopSort]);

  const sort = tab === 'ART' ? artSort : shopSort;
  const setSort = tab === 'ART' ? setArtSort : setShopSort;

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
            tab === 'ART' ? 'border-[#F70071] text-black' : 'border-transparent text-[#ADB0B5]'
          }`}
        >
          아트
        </button>
        <button
          type="button"
          onClick={() => setTab('SHOP')}
          className={`h-12 flex-1 border-b-2 text-[13px] font-semibold ${
            tab === 'SHOP' ? 'border-[#F70071] text-black' : 'border-transparent text-[#ADB0B5]'
          }`}
        >
          샵
        </button>
      </div>

      <section className="pt-5">
        <div className="px-4 mb-5 flex items-center justify-between text-xs text-[#646F7C]">
          <span>{tab === 'ART' ? `아트 ${sortedCards.length}개` : `샵 ${shopGroups.length}개`}</span>

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
                <div className="px-4 fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-6 z-20 w-24 rounded-lg border border-[#eceef1] bg-white py-1 shadow-lg text-center">
                  {(Object.keys(SORT_LABEL) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSort(option);
                        setSortOpen(false);
                      }}
                      className={`block w-full py-2.5 text-xs ${
                        option === sort ? 'font-bold text-[#F70071]' : 'text-gray-600'
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

        {tab === 'ART' ? (
          sortedCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-0.5 gap-y-5">
              {sortedCards.map((card) => (
                <WishArtCard key={card.card_id} card={card} onUnlike={handleArtUnlike} />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-sm text-[#ADB0B5]">찜한 아트가 없어요</p>
          )
        ) : shopGroups.length > 0 ? (
          <div className="flex flex-col gap-6">
            {shopGroups.map((group) => (
              <WishShopCard
                key={group.shopName}
                shopName={group.shopName}
                region={group.region}
                arts={group.arts}
                onUnlike={handleShopUnlike}
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">찜한 샵이 없어요</p>
        )}
      </section>
    </main>
  );
}
