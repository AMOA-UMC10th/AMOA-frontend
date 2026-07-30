// 실제 백엔드 API 연동 함수 모음 (예약 관련)

import type { ArtOption, AdditionalOption } from './mockupdata/reservationData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem('accessToken');

  return {
    Authorization: `Bearer ${token}`,
  };
}

interface ApiResponse<T> {
  code: string;
  message: string;
  isSuccess: boolean;
  result: T;
}

async function parseApiResponse<T>(
  response: Response,
  defaultErrorMessage: string,
): Promise<T> {
  let data: ApiResponse<T>;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(defaultErrorMessage);
  }

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || defaultErrorMessage);
  }

  return data.result;
}

// ─────────────────────────────────────────
// 카드 상세 조회
// GET /api/v1/cards/{cardId}
// ─────────────────────────────────────────

export interface CardDetail {
  cardId: number;
  shopId: number;
  shopName: string;
  instagramUrl: string;
  artType: string;
  designTags: {
    designTagId: number;
    name: string;
  }[];
  minPrice: number;
  maxPrice: number;
  address: string;
  createdMonth: string;
}

export async function getCardDetail(cardId: number): Promise<CardDetail> {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    headers: authHeaders(),
  });

  const result = await parseApiResponse<{
    card: CardDetail;
  }>(response, '카드 정보를 불러오지 못했습니다.');

  return result.card;
}

// ─────────────────────────────────────────
// 샵 옵션 목록 조회
// GET /api/v1/admin/shops/{shopId}/options
// ─────────────────────────────────────────

export interface ShopOption {
  optionId: number;
  optionName: string;
  optionType: string;
  optionPrice: number;
  durationMinutes: number;
  maxQuantity: number;
}

export async function getShopOptions(shopId: number): Promise<ShopOption[]> {
  const response = await fetch(
    `${API_BASE_URL}/admin/shops/${shopId}/options`,
    {
      headers: authHeaders(),
    },
  );

  const result = await parseApiResponse<{
    options: ShopOption[];
  }>(response, '샵 옵션을 불러오지 못했습니다.');

  return result.options;
}

// 기존 컴포넌트가 사용하는 ArtOption/AdditionalOption 형태로 변환
export function splitShopOptions(options: ShopOption[]): {
  artOptions: ArtOption[];
  additionalOptions: AdditionalOption[];
} {
  const artOptions: ArtOption[] = options
    .filter((option) => option.optionType === 'ART')
    .map((option) => ({
      id: option.optionId,
      label: option.optionName,
      badgeMinutes: option.durationMinutes,
      price: option.optionPrice,
    }));

  const additionalOptions: AdditionalOption[] = options
    .filter((option) => option.optionType !== 'ART')
    .map((option) => ({
      id: option.optionId,
      label: option.optionName,
      badgeMinutes: option.durationMinutes,
      unitPrice: option.optionPrice,
      maxCount: option.maxQuantity,
    }));

  return {
    artOptions,
    additionalOptions,
  };
}

// ─────────────────────────────────────────
// 예약 공통 타입
// ─────────────────────────────────────────

export type BackendHandState = 'BARE_NAIL' | 'GEL_NAIL' | 'EXTENSION_NAIL';

export type GelRemovalType = 'NONE' | 'OWN_SHOP' | 'OTHER_SHOP';

export type ReservationStatus =
  | 'DRAFT'
  | 'RESERVED'
  | 'COMPLETED'
  | 'CANCELED'
  | 'CANCELLED';

export type ReservationDisplayStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

interface ReservationStatusData {
  reservationStatus: ReservationStatus;
  reservationDate: string;
}

/**
 * 화면에 표시할 예약 상태를 계산합니다.
 *
 * 1. 서버 상태가 CANCELED/CANCELLED면 시술 취소
 * 2. 서버 상태가 COMPLETED면 시술 완료
 * 3. 취소되지 않았고 예약 날짜가 오늘보다 이전이면 시술 완료
 * 4. 오늘 또는 미래 날짜이면 시술 예정
 */
export function getReservationDisplayStatus({
  reservationStatus,
  reservationDate,
}: ReservationStatusData): ReservationDisplayStatus {
  if (reservationStatus === 'CANCELED' || reservationStatus === 'CANCELLED') {
    return 'CANCELLED';
  }

  if (reservationStatus === 'COMPLETED') {
    return 'COMPLETED';
  }

  const dateParts = reservationDate.split('-').map(Number);

  const [year, month, day] = dateParts;

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return 'UPCOMING';
  }

  const reservationDay = new Date(year, month - 1, day);
  reservationDay.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (reservationDay.getTime() < today.getTime()) {
    return 'COMPLETED';
  }

  return 'UPCOMING';
}

export function formatReservationDateLabel(
  reservationDate?: string,
  reservationStartTime?: string,
): string {
  if (!reservationDate) {
    return '-';
  }

  const [year, month, day] = reservationDate.split('-').map(Number);

  const formattedTime =
    typeof reservationStartTime === 'string'
      ? reservationStartTime.slice(0, 5)
      : '';

  if (!year || !month || !day) {
    return `${reservationDate} ${formattedTime}`.trim();
  }

  return `${month}월 ${day}일 ${formattedTime}`.trim();
}

// ─────────────────────────────────────────
// 예약 생성
// POST /api/v1/reservations
// ─────────────────────────────────────────

export interface SelectedOptionRequest {
  shopOptionId: number;
  quantity: number;
}

export interface CreateReservationDraftRequest {
  cardId: number;
  handStates: BackendHandState[];
  gelRemovalType: GelRemovalType;
  extensionRemovalCount: number;
  selectedOptions: SelectedOptionRequest[];
}

export interface ReservationDraftResult {
  reservationId: number;
  reservationNumber: string;
  cardId: number;
  shopId: number;
  handStates: BackendHandState[];
  gelRemovalType: GelRemovalType;
  extensionRemovalCount: number;
  totalPrice: number;
  depositAmount: number;
  totalDurationMinutes: number;
  reservationStatus: ReservationStatus;
}

export async function createReservationDraft(
  payload: CreateReservationDraftRequest,
): Promise<ReservationDraftResult> {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<ReservationDraftResult>(
    response,
    '예약 생성에 실패했습니다.',
  );
}

// ─────────────────────────────────────────
// 예약 가능한 날짜·시간 조회
// GET /api/v1/reservations/{reservationId}/available-times
// ─────────────────────────────────────────

export interface AvailableTimeSlot {
  time: string;
  isAvailable: number;
}

export interface AvailableTimesResult {
  reservationId: number;
  reservationDate: string;
  totalDurationMinutes: number;
  requiredSlotCount: number;
  businessOpeningTime: string;
  businessClosingTime: string;
  availableTimes: AvailableTimeSlot[];
}

export async function getAvailableTimes(
  reservationId: number,
  date: string,
): Promise<AvailableTimesResult> {
  const searchParams = new URLSearchParams({
    date,
  });

  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}/available-times?${searchParams.toString()}`,
    {
      headers: authHeaders(),
    },
  );

  return parseApiResponse<AvailableTimesResult>(
    response,
    '예약 가능한 시간을 불러오지 못했습니다.',
  );
}

// ─────────────────────────────────────────
// 예약 최종 확정
// PATCH /api/v1/reservations/{reservationId}/schedule
// ─────────────────────────────────────────

export type PaymentMethod = 'KAKAO_PAY' | 'CARD';

export interface ConfirmReservationScheduleRequest {
  reservationDate: string;
  reservationStartTime: string;
  requestMessage: string;
  paymentMethod: PaymentMethod;
  refundPolicyAgreed: boolean;
}

export interface ConfirmReservationScheduleResult {
  reservationId: number;
  shopName: string;
  artName: string;
  reservationDate: string;
  reservationStartTime: string;
  totalPrice: number;
}

export async function confirmReservationSchedule(
  reservationId: number,
  payload: ConfirmReservationScheduleRequest,
): Promise<ConfirmReservationScheduleResult> {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}/schedule`,
    {
      method: 'PATCH',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return parseApiResponse<ConfirmReservationScheduleResult>(
    response,
    '예약 확정에 실패했습니다.',
  );
}

// ─────────────────────────────────────────
// 예약 목록 조회
// GET /api/v1/reservations?size=10
// ─────────────────────────────────────────

export interface ReservationListItem {
  reservationId: number;
  reservationStatus: ReservationStatus;
  shopName: string;
  artName: string;
  reservationDate: string;
  reservationStartTime: string;
  totalPrice: number;
}

interface ReservationListResult {
  reservations: ReservationListItem[];
}

export async function getMyReservations(
  size = 10,
): Promise<ReservationListItem[]> {
  const searchParams = new URLSearchParams({
    size: String(size),
  });

  const response = await fetch(
    `${API_BASE_URL}/reservations?${searchParams.toString()}`,
    {
      headers: authHeaders(),
    },
  );

  const result = await parseApiResponse<ReservationListResult>(
    response,
    '예약 내역을 불러오지 못했습니다.',
  );

  return result.reservations;
}

// ─────────────────────────────────────────
// 예약 상세 조회
// GET /api/v1/reservations/{reservationId}
// ─────────────────────────────────────────

export interface ReservationDetail {
  reservationId: number;
  reservationStatus: ReservationStatus;
  shopName: string;
  artName: string;
  reservationDate: string;
  reservationStartTime: string;
  totalPrice: number;
  paymentAmount: number;
  customerName: string;
  customerPhoneNumber: string;
  requestMessage: string;
  kakaoChannelUrl: string;
}

export async function getMyReservationDetail(
  reservationId: number,
): Promise<ReservationDetail> {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}`,
    {
      headers: authHeaders(),
    },
  );

  return parseApiResponse<ReservationDetail>(
    response,
    '예약 상세 정보를 불러오지 못했습니다.',
  );
}

// ─────────────────────────────────────────
// 예약 취소
// PATCH /api/v1/reservations/{reservationId}/cancel
// Swagger 기준 Request Body 없음
// ─────────────────────────────────────────

export async function cancelMyReservation(
  reservationId: number,
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}/cancel`,
    {
      method: 'PATCH',
      headers: authHeaders(),
    },
  );

  return parseApiResponse<string>(response, '예약 취소에 실패했습니다.');
}

// ─────────────────────────────────────────
// 내 정보 조회
// GET /api/v1/users/me/profile
// ─────────────────────────────────────────

export { fetchMyProfile as getMyProfile } from './profile';

export type { MyProfile } from './profile';
