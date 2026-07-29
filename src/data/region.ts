// ===== 타입 =====

// 백엔드가 보내주는 지역 1개 객체의 타입
export interface Region {
  regionId: number;
  firstDepth: string;
  secondDepth: string;
  thirdDepth: string;
}

// API 전체 응답 타입
export interface RegionApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Region[];
}

// 검색 결과 리스트(RegionResult)에서 사용하는 UI 타입
export interface RegionMatch {
  id: string;
  district: string;
  keyword: string;
}

// ===== API 호출 =====

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/regions`;

export async function searchRegions(keyword: string): Promise<RegionMatch[]> {
  if (!keyword.trim()) return [];

  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${BASE_URL}?keyword=${encodeURIComponent(keyword)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`지역 검색 요청 실패: ${res.status}`);
  }

  const data: RegionApiResponse = await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result.map(toRegionMatch);
}

// 좌표를 법정동으로 바꿔준다. 지역 검색(searchRegions)과 달리 결과가 한 건이다.
export async function getPresentRegion(
  latitude: number,
  longitude: number,
): Promise<Region> {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${BASE_URL}/present?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: token
        ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
        : {},
    }
  );

  if (!res.ok) {
    throw new Error(`현재 위치 지역 조회 실패: ${res.status}`);
  }

  const data: { isSuccess: boolean; message: string; result: Region } =
    await res.json();

  if (!data.isSuccess) {
    throw new Error(data.message);
  }

  return data.result;
}

function toRegionMatch(region: Region): RegionMatch {
  return {
    id: String(region.regionId),
    district: `${region.firstDepth} ${region.secondDepth}`.trim(),
    keyword: region.thirdDepth,
  };
}
