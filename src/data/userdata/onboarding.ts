// [A101~A106] 온보딩 정보 저장 API

export interface OnboardingAgreement {
  termId: number;
  agreed: boolean;
}

export interface OnboardingSavePayload {
  nickname: string;
  phoneNumber: string;
  designTagIds: number[];
  regionIds: number[];
  agreements: OnboardingAgreement[];
}

export interface OnboardingSaveResult {
  userId: number;
  onboardingCompleted: boolean;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/onboarding`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {}),
  };
}

export async function saveOnboarding(
  payload: OnboardingSavePayload,
): Promise<OnboardingSaveResult> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`온보딩 정보 저장 실패: ${res.status} ${body}`);
  }
  const data: ApiResponse<OnboardingSaveResult> = await res.json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result;
}