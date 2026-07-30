// 마이페이지 - 내 정보 조회/수정, 닉네임 중복확인 API

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 주의: 이 엔드포인트만 지역 이름을 regionNDepthName으로 내려준다.
// 지역 검색(GET /regions)은 같은 값을 firstDepth/secondDepth/thirdDepth로 준다.
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

// PATCH는 부분 수정이라 보낸 필드만 반영된다.
// 단, 디자인태그와 관심지역은 서버가 필수로 요구하고 빈 배열을 보내면 전체 삭제된다.
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

// 서버는 하이픈 없는 형식(01012345678)만 받는다.
function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  if (!token) return {};
  return {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

async function parse<T>(res: Response, label: string): Promise<T> {
  // 실패 응답에도 서버가 안내 문구를 담아준다(예: 429 "잠시 후 다시 시도해주세요.").
  // 화면에 그대로 보여주기 위해 상태 코드보다 이 메시지를 우선한다.
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
  const res = await fetch(`${BASE_URL}/users/me/profile`, {
    headers: authHeaders(),
  });
  return parse<UserProfile>(res, '내 정보 조회');
}

export async function updateMyProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/users/me/profile`, {
    method: 'PATCH',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parse<UserProfile>(res, '내 정보 수정');
}

export interface PhoneSendResult {
  expiresInSeconds: number;
}

export interface PhoneVerifyResult {
  verified: boolean;
}

// 인증번호는 6자리, 3분간 유효. 같은 번호로는 30초 이내 재요청이 막힌다.
export async function sendPhoneCode(
  phoneNumber: string,
): Promise<PhoneSendResult> {
  const res = await fetch(`${BASE_URL}/users/phone/send`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: onlyDigits(phoneNumber) }),
  });
  return parse<PhoneSendResult>(res, '인증번호 발송');
}

// 5회 이상 틀리면 인증번호가 폐기되어 재발송이 필요하다.
export async function verifyPhoneCode(
  phoneNumber: string,
  code: string,
): Promise<PhoneVerifyResult> {
  const res = await fetch(`${BASE_URL}/users/phone/verify`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: onlyDigits(phoneNumber), code }),
  });
  return parse<PhoneVerifyResult>(res, '인증번호 확인');
}

export async function checkNickname(
  nickname: string,
): Promise<NicknameCheckResult> {
  const res = await fetch(
    `${BASE_URL}/users/nickname/check?nickname=${encodeURIComponent(nickname)}`,
    { headers: authHeaders() },
  );
  return parse<NicknameCheckResult>(res, '닉네임 중복 확인');
}