// ===== 타입 =====

import { authFetch } from "../api/authFetch";

export interface NotificationSetting {
  notificationType: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface NotificationSettingUpdate {
  notificationType: string;
  enabled: boolean;
}

export interface InterestedRegion {
  regionId: number;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
}

export interface MyProfile {
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

interface ProfileApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/me/profile`;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchMyProfile(): Promise<MyProfile> {
  const res = await authFetch(BASE_URL, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`내 정보 조회 실패: ${res.status}`);
  }

  const data: ProfileApiResponse<MyProfile> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

export async function updateNotificationSettings(
  profile: MyProfile,
  notificationSettings: NotificationSettingUpdate[],
): Promise<MyProfile> {
  const res = await authFetch(BASE_URL, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profileImageUrl: profile.profileImageUrl,
      nickname: profile.nickname,
      phoneNumber: profile.phoneNumber,
      selectedDesignTagIds: profile.selectedDesignTagIds,
      interestedRegionIds: profile.interestedRegions.map((region) => region.regionId),
      notificationSettings,
    }),
  });

  if (!res.ok) {
    throw new Error(`알림 설정 저장 실패: ${res.status}`);
  }

  const data: ProfileApiResponse<MyProfile> = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}
