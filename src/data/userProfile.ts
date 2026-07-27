// [F101] 내 정보 조회/수정 API (마이페이지 - 내 정보 관리)

export interface NotificationSetting {
  notificationType: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface InterestedRegion {
  regionId: number;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
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

export interface UserProfileUpdatePayload {
  profileImageUrl?: string;
  nickname?: string;
  phoneNumber?: string;
  selectedDesignTagIds?: number[];
  interestedRegionIds?: number[];
  notificationSettings?: { notificationType: string; enabled: boolean }[];
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/me/profile`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`내 정보 조회 실패: ${res.status}`);
  }
  const data: ApiResponse<UserProfile> = await res.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
}

export async function updateMyProfile(
  payload: UserProfileUpdatePayload,
): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/me/profile`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`내 정보 수정 실패: ${res.status} ${body}`);
  }
  const data: ApiResponse<UserProfile> = await res.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
}

export async function checkNicknameAvailable(nickname: string): Promise<boolean> {
  const res = await fetch(
    `${BASE_URL}/nickname/check?nickname=${encodeURIComponent(nickname)}`,
    { headers: authHeaders() },
  );
  if (!res.ok) {
    throw new Error(`닉네임 중복확인 실패: ${res.status}`);
  }
  const data: ApiResponse<{ nickname: string; available: boolean }> = await res.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result.available;
}
