// I101 예약 데모 화면 mock 데이터
// ※ 스코프 안내: 샵이 직접 시술 항목·가격을 등록하는 기능이 없는 MVP 단계라,
//   아래 항목/가격은 전부 어드민이 임의로 입력한 더미 데이터입니다. (목업 이미지 값 그대로 반영)
// TODO: 백엔드에 샵별 시술 항목 등록 기능이 생기면 GET /api/shops/{shopId}/reservation-options 로 교체

export type HandStatusId = 'BARE' | 'GEL_REMOVAL' | 'EXTENSION_REMOVAL';
export type GelRemovalShop = 'OWN_SHOP' | 'OTHER_SHOP';

export interface HandStatusOption {
  id: HandStatusId;
  label: string;
  price: number;
  badgeMinutes?: number;
}

export const HAND_STATUS_OPTIONS: HandStatusOption[] = [
  { id: 'BARE', label: '맨손이에요', price: 40000 },
  { id: 'GEL_REMOVAL', label: '젤 제거할게요', price: 0},
  { id: 'EXTENSION_REMOVAL', label: '연장 제거할게요', price: 0},
];

export const EXTENSION_REMOVAL_UNIT_PRICE = 5000;
export const EXTENSION_REMOVAL_MAX_COUNT = 10;

export interface ArtOption {
  id: string;
  label: string;
  badgeMinutes: number;
  price: number;
}

export const ART_OPTIONS: ArtOption[] = [
  { id: 'art-1', label: '12월 이달의 아트', badgeMinutes: 20, price: 40000 },
  { id: 'art-2', label: '12월 이달의 아트', badgeMinutes: 20, price: 50000 },
];

export interface AdditionalOption {
  id: string;
  label: string;
  badgeMinutes: number;
  unitPrice: number;
  maxCount: number;
}

export const ADDITIONAL_OPTIONS: AdditionalOption[] = [
  {
    id: 'extend',
    label: '연장',
    badgeMinutes: 20,
    unitPrice: 5000,
    maxCount: 10,
  },
  {
    id: 'wrapping',
    label: '랩핑',
    badgeMinutes: 20,
    unitPrice: 5000,
    maxCount: 10,
  },
];

export const BASE_DURATION_MINUTES = 60; // 기본 시술 1시간
export const RESERVATION_DEPOSIT = 20000; // 예약금 고정

export interface TimeSlot {
  time: string;
  available: boolean;
}

const ALL_TIME_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
];

// TODO: 백엔드에 날짜별 예약 가능 시간대 조회 API로 교체
export function getTimeSlotsForDate(_dateKey: string): TimeSlot[] {
  const closed = ['11:00', '12:00', '02:00']; // mock: 마감 시간대
  return ALL_TIME_SLOTS.map((time) => ({
    time,
    available: !closed.includes(time),
  }));
}

export interface ReservationSelection {
  handStatus: HandStatusId[];
  extensionRemovalCount: number;
  selectedArtId: string | null;
  additionalCounts: Record<string, number>;
}

export function calculateTotalPrice(selection: ReservationSelection): number {
  let total = 0;

  selection.handStatus.forEach((id) => {
    const option = HAND_STATUS_OPTIONS.find((o) => o.id === id);
    if (option) total += option.price;
  });

  if (selection.handStatus.includes('EXTENSION_REMOVAL')) {
    total += selection.extensionRemovalCount * EXTENSION_REMOVAL_UNIT_PRICE;
  }

  const art = ART_OPTIONS.find((a) => a.id === selection.selectedArtId);
  if (art) total += art.price;

  ADDITIONAL_OPTIONS.forEach((option) => {
    const count = selection.additionalCounts[option.id] ?? 0;
    total += count * option.unitPrice;
  });

  return total;
}

// ⚠️ 추가옵션(연장/래핑)도 소요시간에 영향을 줍니다. 개당 20분씩 추가돼요.
export function calculateTotalDuration(
  selection: ReservationSelection,
): number {
  const art = ART_OPTIONS.find((a) => a.id === selection.selectedArtId);
  let total = BASE_DURATION_MINUTES + (art?.badgeMinutes ?? 0);

  ADDITIONAL_OPTIONS.forEach((option) => {
    const count = selection.additionalCounts[option.id] ?? 0;
    total += count * option.badgeMinutes;
  });

  return total;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getTodayKey(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 날짜 포맷 함수
export function formatDateLabel(dateKey: string): string {
  const [, month, day] = dateKey.split('-').map(Number);
  return `${month}월 ${day}일`;
}
