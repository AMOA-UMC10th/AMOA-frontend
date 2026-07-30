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
  { id: 'BARE', label: '맨손이에요', price: 0 },
  { id: 'GEL_REMOVAL', label: '젤 제거할게요', price: 0, badgeMinutes: 10 },
  {
    id: 'EXTENSION_REMOVAL',
    label: '연장 제거할게요',
    price: 0,
    badgeMinutes: 2,
  },
];

export const EXTENSION_REMOVAL_UNIT_PRICE = 1000;
export const EXTENSION_REMOVAL_MAX_COUNT = 10;
export const GEL_REMOVAL_OTHER_SHOP_SURCHARGE = 5000; // 추가 — 타샵 젤제거 추가비용

export interface ArtOption {
  id: number;
  label: string;
  badgeMinutes: number;
  price: number;
}

export const ART_OPTIONS: ArtOption[] = [
  { id: 1, label: '12월 이달의 아트', badgeMinutes: 20, price: 40000 },
  { id: 2, label: '12월 이달의 아트', badgeMinutes: 20, price: 50000 },
];

export interface AdditionalOption {
  id: number;
  label: string;
  badgeMinutes: number;
  unitPrice: number;
  maxCount: number;
}

export const ADDITIONAL_OPTIONS: AdditionalOption[] = [
  { id: 1, label: '연장', badgeMinutes: 20, unitPrice: 5000, maxCount: 10 },
  { id: 2, label: '랩핑', badgeMinutes: 20, unitPrice: 5000, maxCount: 10 },
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
  gelRemovalShop: GelRemovalShop | null;
  extensionRemovalCount: number;
  selectedArtId: number | null;
  additionalCounts: Record<number, number>;
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

  if (
    selection.handStatus.includes('GEL_REMOVAL') &&
    selection.gelRemovalShop === 'OTHER_SHOP'
  ) {
    total += GEL_REMOVAL_OTHER_SHOP_SURCHARGE;
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
  let total = art?.badgeMinutes ?? 0;

  selection.handStatus.forEach((id) => {
    const option = HAND_STATUS_OPTIONS.find((o) => o.id === id);
    if (!option?.badgeMinutes) return;

    if (id === 'EXTENSION_REMOVAL') {
      total += selection.extensionRemovalCount * option.badgeMinutes;
    } else {
      total += option.badgeMinutes;
    }
  });

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

// ─────────────────────────────────────────
// F102/F103 예약 내역 (localStorage 저장)
// ─────────────────────────────────────────

const RESERVATIONS_STORAGE_KEY = 'amoa_reservations';

export interface SavedReservation {
  id: string;
  cardId: number;
  shopName: string;
  artLabel: string;
  date: string; // YYYY-MM-DD
  time: string;
  totalPrice: number;
  depositPrice: number;
  customerName: string;
  customerPhone: string;
  requestNote: string;
  isCancelled: boolean;
  cancelledAt?: number;
  createdAt: number;
}

export type DisplayStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

// '01:00'~'05:00'은 오후 시간대라 +12, 10/11/12시는 그대로 둠 (영업시간 10:00~17:00 가정)
function to24HourMinutes(time: string): number {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (h >= 1 && h <= 9) h += 12;
  return h * 60 + m;
}

export function getReservationDateTime(dateKey: string, time: string): Date {
  const [y, mo, d] = dateKey.split('-').map(Number);
  const totalMinutes = to24HourMinutes(time);
  return new Date(
    y,
    mo - 1,
    d,
    Math.floor(totalMinutes / 60),
    totalMinutes % 60,
  );
}

// 목록/상세 카드용 "O월 O일 · HH:mm" 라벨 — 날짜 부분은 위 formatDateLabel 재사용
export function formatReservationDateLabel(
  dateKey: string,
  time: string,
): string {
  return `${formatDateLabel(dateKey)}  ${time}`;
}

export function formatCancelledDateLabel(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// 상태는 저장 안 하고 매번 계산해요. isCancelled만 저장하고,
// 취소 안 됐으면 예약 일시가 지났는지로 '완료' 여부를 판단해요.
export function getDisplayStatus(reservation: SavedReservation): DisplayStatus {
  if (reservation.isCancelled) {
    return 'CANCELLED';
  }

  const reservationDateTime = getReservationDateTime(
    reservation.date,
    reservation.time,
  );

  const isCompleted = reservationDateTime.getTime() <= Date.now();

  return isCompleted ? 'COMPLETED' : 'UPCOMING';
}

export function getReservations(): SavedReservation[] {
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedReservation[];
  } catch {
    return [];
  }
}

export function saveReservation(reservation: SavedReservation): void {
  const list = getReservations();
  list.unshift(reservation);
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(list));
}

export function getReservationById(id: string): SavedReservation | undefined {
  return getReservations().find((r) => r.id === id);
}

export function cancelReservation(id: string): SavedReservation | undefined {
  const list = getReservations();
  const now = Date.now();
  const updated = list.map((r) =>
    r.id === id ? { ...r, isCancelled: true, cancelledAt: now } : r,
  );
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
  return updated.find((r) => r.id === id);
}

// ─────────────────────────────────────────
// 테스트용 목업 예약 데이터
// 이번 달 예정 / 지난 달 완료 / 지난 달 취소
// ─────────────────────────────────────────

const MOCK_RESERVATION_PREFIX = 'mock-reservation';

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

export function seedMockReservations(): void {
  const now = new Date();
  const nowTimestamp = Date.now();

  // 이번 달 미래 예약 → 시술 예정
  const upcomingDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 3,
  );

  // 지난달 날짜 계산
  const lastMonthCompletedDate = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    20,
  );

  const lastMonthCancelledDate = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    20,
  );

  const mockData: SavedReservation[] = [
    {
      id: `${MOCK_RESERVATION_PREFIX}-upcoming`,
      cardId: 1,
      shopName: '미니숍네일',
      artLabel: '12월 이달의 아트',
      date: toDateKey(upcomingDate),
      time: '02:00',
      totalPrice: 40000,
      depositPrice: RESERVATION_DEPOSIT,
      customerName: '홍길동',
      customerPhone: '010-1234-5678',
      requestNote: '경력 많은 쌤으로 예약해주세요',
      isCancelled: false,
      createdAt: nowTimestamp,
    },
    {
      id: `${MOCK_RESERVATION_PREFIX}-completed`,
      cardId: 4,
      shopName: '뷰티네일',
      artLabel: '11월 이달의 아트',
      date: toDateKey(lastMonthCompletedDate),
      time: '11:00',
      totalPrice: 55000,
      depositPrice: RESERVATION_DEPOSIT,
      customerName: '홍길동',
      customerPhone: '010-1234-5678',
      requestNote: '',
      isCancelled: false,
      createdAt: nowTimestamp - 1000,
    },
    {
      id: `${MOCK_RESERVATION_PREFIX}-cancelled`,
      cardId: 4,
      shopName: '뷰티네일',
      artLabel: '11월 이달의 아트',
      date: toDateKey(lastMonthCancelledDate),
      time: '11:00',
      totalPrice: 55000,
      depositPrice: RESERVATION_DEPOSIT,
      customerName: '홍길동',
      customerPhone: '010-1234-5678',
      requestNote: '',
      isCancelled: true,
      cancelledAt: nowTimestamp - 500,
      createdAt: nowTimestamp - 2000,
    },
  ];

  const existing = getReservations();

  // 기존 목업 데이터 제거
  // 사용자가 실제로 만든 예약 데이터는 유지
  const realReservations = existing.filter(
    (reservation) => !reservation.id.startsWith(MOCK_RESERVATION_PREFIX),
  );

  localStorage.setItem(
    RESERVATIONS_STORAGE_KEY,
    JSON.stringify([...mockData, ...realReservations]),
  );
}
