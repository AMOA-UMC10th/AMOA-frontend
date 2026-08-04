// 마이페이지 - 내 정보 조회/수정, 닉네임 중복확인 API

import { authFetch } from "../../api/authFetch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface InterestedRegion {
  regionId: number;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
}

export interface NotificationSetting {
  notificationType: 'MARKETING' | 'RESERVATION' | 'EVENT';
  title: string;
  description: string;
  enabled: boolean;
}

export interface UserProfile {
  userId: number;
  profileImageUrl: string;
  name: string;
  email: string;
  nickname: string;
  phoneNumber: string;
  selectedDesignTagIds: number[];
  interestedRegions: InterestedRegion[];
  notificationSettings: NotificationSetting[];
}

export interface UpdateProfileRequest {
  profileImageUrl?: string;
  nickname?: string;
  phoneNumber?: string;
  selectedDesignTagIds: number[];
  interestedRegionIds: number[];
  notificationSettings?: { notificationType: string; enabled: boolean }[];
}

export interface NicknameCheckResult {
  nickname: string;
  available: boolean;
}

export interface PhoneSendResult {
  expiresInSeconds: number;
}

export interface PhoneVerifyResult {
  verified: boolean;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken') ?? localStorage.getItem('tempToken');
  if (!token) return {};
  return {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

async function parse<T>(res: Response, label: string): Promise<T> {
  let data: ApiResponse<T> | null = null;
  try {
    data = (await res.json()) as ApiResponse<T>;
  } catch {
    data = null;
  }

  if (!res.ok || !data?.isSuccess) {
    throw new Error(data?.message || `${label} 실패: ${res.status}`);
  }
  return data.result;
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await authFetch(`${BASE_URL}/users/me/profile`, {
  });
  return parse<UserProfile>(res, '내 정보 조회');
}

export async function updateMyProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const res = await authFetch(`${BASE_URL}/users/me/profile`, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parse<UserProfile>(res, '내 정보 수정');
}

export async function sendPhoneCode(phone: string): Promise<PhoneSendResult> {
  const token = localStorage.getItem('tempToken') ?? localStorage.getItem('accessToken');
  const authHeader = token?.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');

  const res = await fetch(`${BASE_URL}/users/phone/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({ phoneNumber: onlyDigits(phone) }),
  });

  return parse<PhoneSendResult>(res, '인증번호 발송');
}

export async function verifyPhoneCode(
  phoneNumber: string,
  code: string,
): Promise<PhoneVerifyResult> {
  const token = localStorage.getItem('tempToken') ?? localStorage.getItem('accessToken');
  const authHeader = token?.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');

  const res = await fetch(`${BASE_URL}/users/phone/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({ phoneNumber: onlyDigits(phoneNumber), code }),
  });

  return parse<PhoneVerifyResult>(res, '인증번호 확인');
}

export async function checkNickname(
  nickname: string,
): Promise<NicknameCheckResult> {
  const res = await authFetch(
    `${BASE_URL}/users/nickname/check?nickname=${encodeURIComponent(nickname)}`,
  );
  return parse<NicknameCheckResult>(res, '닉네임 중복 확인');
}

export async function updateProfileImage(file: File): Promise<{ profileImageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('accessToken') ?? localStorage.getItem('tempToken');
  const accessToken = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/users/me/profile-image`, {
    method: 'PATCH',
    headers: {
      ...(accessToken ? { Authorization: accessToken } : {}),
    },
    body: formData,
  });

  return parse<{ profileImageUrl: string }>(res, '프로필 이미지 수정');
}