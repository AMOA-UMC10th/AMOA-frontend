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
  accessToken?: string; // 온보딩 완료 후 정식 accessToken 발급 시 저장
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users/onboarding`;

// accessToken이 우선하며, 없으면 온보딩용 tempToken 사용
function authHeaders(): Record<string, string> {
  const token =
    localStorage.getItem('accessToken') ?? localStorage.getItem('tempToken');
  if (!token) return { 'Content-Type': 'application/json' };

  return {
    'Content-Type': 'application/json',
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  };
}

export async function saveOnboarding(
  payload: OnboardingSavePayload,
): Promise<OnboardingSaveResult> {
  // 백엔드가 요구하는 데이터 형식을 정확히 맞춤
  const formattedPayload = {
    nickname: payload.nickname,
    phoneNumber: payload.phoneNumber.replace(/\D/g, ''), // 숫자만 추출
    designTagIds: payload.designTagIds,
    regionIds: payload.regionIds,
    agreements: payload.agreements.map((a) => ({
      termId: Number(a.termId),
      agreed: Boolean(a.agreed),
    })),
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(formattedPayload),
  });

  let data: ApiResponse<OnboardingSaveResult> | null = null;
  try {
    data = (await res.json()) as ApiResponse<OnboardingSaveResult>;
  } catch {
    data = null;
  }

  if (!res.ok || !data?.isSuccess) {
    throw new Error(data?.message || `온보딩 정보 저장 실패: ${res.status}`);
  }

  // 온보딩 완료 후 정식 토큰이 반환되는 경우 localStorage 갱신
  if (data.result?.accessToken) {
    localStorage.setItem('accessToken', data.result.accessToken);
    localStorage.removeItem('tempToken');
  }

  return data.result;
}