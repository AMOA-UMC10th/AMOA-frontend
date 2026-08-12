// 찜 상태를 화면 사이에서 공유하는 저장소.
//
// 기존에는 ArtLikeBtn / ShopLikeBtn이 각자 useState로 로컬 상태만 들고 있어서,
// 목록에서 찜해도 상세 화면으로 넘어가면 반영되지 않았다.
// 여기를 단일 출처로 두고 모든 하트가 같은 값을 보게 한다.
//
// 카드 상세 API(GET /cards/{cardId})는 isLiked를 내려주지 않으므로,
// 상세 화면을 새로고침으로 바로 열었을 때를 위해 찜 목록으로 한 번 채워둔다.

import { useSyncExternalStore } from 'react';
import { getLikedCards, getLikedShops } from './likeList';

const likedCards = new Map<number, boolean>();
const likedShops = new Map<number, boolean>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCardLiked(cardId: number, liked: boolean) {
  likedCards.set(cardId, liked);
  emit();
}

export function setShopLiked(shopId: number, liked: boolean) {
  likedShops.set(shopId, liked);
  emit();
}

// 저장소가 모르는 id는 undefined를 돌려준다. 그때는 호출한 쪽이 넘긴 값을 그대로 쓴다.
// (서버 응답의 isLiked가 이미 정확한 경우가 대부분이라 굳이 덮어쓰지 않는다)
export function useCardLiked(cardId: number | undefined, fallback: boolean) {
  const stored = useSyncExternalStore(subscribe, () =>
    cardId === undefined ? undefined : likedCards.get(cardId),
  );
  return stored ?? fallback;
}

export function useShopLiked(shopId: number | undefined, fallback: boolean) {
  const stored = useSyncExternalStore(subscribe, () =>
    shopId === undefined ? undefined : likedShops.get(shopId),
  );
  return stored ?? fallback;
}

// 찜 목록 화면처럼 "여기 있는 건 전부 찜한 것"이 확실한 응답을 받았을 때 한 번에 채운다.
export function markCardsLiked(cardIds: number[]) {
  cardIds.forEach((id) => likedCards.set(id, true));
  emit();
}

export function markShopsLiked(shopIds: number[]) {
  shopIds.forEach((id) => likedShops.set(id, true));
  emit();
}

function isLoggedIn() {
  return Boolean(localStorage.getItem('accessToken'));
}

// 이미 알고 있는 id는 건드리지 않는다. 사용자가 방금 누른 값이 목록 응답보다 최신이다.
function fill(map: Map<number, boolean>, ids: number[]) {
  ids.forEach((id) => {
    if (!map.has(id)) map.set(id, true);
  });
  emit();
}

let cardsHydration: Promise<void> | null = null;
let shopsHydration: Promise<void> | null = null;

export function hydrateLikedCards(): Promise<void> {
  if (cardsHydration) return cardsHydration;
  if (!isLoggedIn()) return Promise.resolve();

  cardsHydration = getLikedCards('LATEST', 0, 100)
    .then((result) => fill(likedCards, result.cards.map((card) => card.cardId)))
    .catch((err) => {
      console.error(err);
      cardsHydration = null; // 실패했으면 다음 진입 때 다시 시도한다.
    });

  return cardsHydration;
}

export function hydrateLikedShops(): Promise<void> {
  if (shopsHydration) return shopsHydration;
  if (!isLoggedIn()) return Promise.resolve();

  shopsHydration = getLikedShops('LATEST', 0, 100)
    .then((result) => fill(likedShops, result.likedShops.map((shop) => shop.shopId)))
    .catch((err) => {
      console.error(err);
      shopsHydration = null;
    });

  return shopsHydration;
}
