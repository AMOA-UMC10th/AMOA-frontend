// 실제 백엔드 API 연동 함수 모음 (예약 관련)

import type { ArtOption, AdditionalOption } from './mockupdata/reservationData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem('accessToken');
  return { Authorization: `Bearer ${token}` };
}

// ─────────────────────────────────────────
// 카드 상세 조회 — GET /api/v1/cards/{cardId}
// ─────────────────────────────────────────

export interface CardDetail {
  cardId: number;
  shopId: number;
  shopName: string;
  instagramUrl: string;
  artType: string;
  designTags: { designTagId: number; name: string }[];
  minPrice: number;
  maxPrice: number;
  address: string;
  createdMonth: string;
}

export async function getCardDetail(cardId: number): Promise<CardDetail> {
  const res = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.card;
}

// ─────────────────────────────────────────
// 샵 옵션 목록 조회 — GET /api/v1/admin/shops/{shopId}/options
// ─────────────────────────────────────────

export interface ShopOption {
  optionId: number;
  optionName: string;
  optionType: string; // 'ART' 확인됨, 그 외 타입(추가옵션)은 실제 응답 받아봐야 정확한 값 확인 가능
  optionPrice: number;
  durationMinutes: number;
  maxQuantity: number;
}

export async function getShopOptions(shopId: number): Promise<ShopOption[]> {
  const res = await fetch(`${API_BASE_URL}/admin/shops/${shopId}/options`, {
    headers: authHeaders(),
  });
  const data = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.options;
}

// 기존 ArtOption/AdditionalOption 형태로 변환 (OptionSelector, 가격계산 함수가
// 이미 이 필드명 기준으로 짜여있어서, 실제 응답을 여기 맞춰 변환해줌)
export function splitShopOptions(options: ShopOption[]): {
  artOptions: ArtOption[];
  additionalOptions: AdditionalOption[];
} {
  const artOptions: ArtOption[] = options
    .filter((o) => o.optionType === 'ART')
    .map((o) => ({
      id: o.optionId,
      label: o.optionName,
      badgeMinutes: o.durationMinutes,
      price: o.optionPrice,
    }));

  const additionalOptions: AdditionalOption[] = options
    .filter((o) => o.optionType !== 'ART')
    .map((o) => ({
      id: o.optionId,
      label: o.optionName,
      badgeMinutes: o.durationMinutes,
      unitPrice: o.optionPrice,
      maxCount: o.maxQuantity,
    }));

  return { artOptions, additionalOptions };
}

// ─────────────────────────────────────────
// 예약 생성 (손상태/아트/추가옵션 선택 완료 → DRAFT 생성)
// POST /api/v1/reservations
// ─────────────────────────────────────────

export type BackendHandState = 'BARE_NAIL' | 'GEL_NAIL' | 'EXTENSION_NAIL';
export type GelRemovalType = 'NONE' | 'OWN_SHOP' | 'OTHER_SHOP';
export type ReservationStatus =
  | 'DRAFT' // 예약 생성(옵션 선택 완료)
  | 'RESERVED' // 예약 확정(시술 예정)
  | 'COMPLETED' // 시술 완료
  | 'CANCELED'; // 예약 취소

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
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

// ─────────────────────────────────────────
// 예약 가능한 날짜·시간 조회
// GET /api/v1/reservations/{reservationId}/available-times?date=YYYY-MM-DD
// ─────────────────────────────────────────

export interface AvailableTimeSlot {
  time: string;
  isAvailable: number; // 0 | 1
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
  const res = await fetch(
    `${API_BASE_URL}/reservations/${reservationId}/available-times?date=${date}`,
    { headers: authHeaders() },
  );
  const data = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

// ─────────────────────────────────────────
// 예약 최종 확정 (날짜·시간·결제수단·요청사항)
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
  const res = await fetch(
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
  const data = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

// ─────────────────────────────────────────
// 내 정보 조회 (예약자 이름/전화번호 자동 채움용)
// GET /api/v1/users/me/profile
// profile.ts의 fetchMyProfile과 같은 엔드포인트라 재사용
// ─────────────────────────────────────────

export { fetchMyProfile as getMyProfile } from './profile';
export type { MyProfile } from './profile';
