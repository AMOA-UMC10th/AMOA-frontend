// ===== 타입 =====

import { authFetch } from "../api/authFetch";

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

  // 🔑 토큰 없이 요청 보내기
  const res = await authFetch(
    `${BASE_URL}?keyword=${encodeURIComponent(keyword)}`
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

export function shortenSido(name: string): string {
  return name
    .replace(/(특별자치시|특별시|광역시)$/, "시")
    .replace(/특별자치도$/, "도");
}

// 백엔드가 "성남시분당구"처럼 시와 구를 붙여서 내려준다. 그대로 그리면 붙어 보이므로
// 시 뒤에 구가 이어질 때만 사이를 띄운다. ("성동구"처럼 구만 있는 값은 그대로 둔다)
export function spaceSigungu(name: string): string {
  return name.replace(/^(.+시)(.+구)$/, "$1 $2");
}

// 칩과 필터는 시/도를 떼고 보여준다. district는 "서울시 성동구",
// "경기도 성남시 분당구"처럼 맨 앞에 시/도가 붙어 있어서 첫 토큰만 걷어낸다.
// (마지막 토큰만 남기면 "성남시 분당구"에서 "성남시"가 잘려나간다)
export function stripSido(district: string): string {
  const [, ...rest] = district.split(" ");
  return rest.length > 0 ? rest.join(" ") : district;
}

export async function getPresentRegion(
  latitude: number,
  longitude: number,
): Promise<Region> {
  const token = localStorage.getItem("accessToken");

  const res = await authFetch(
    `${BASE_URL}/present?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: token
        ? {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          }
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
    district: `${shortenSido(region.firstDepth)} ${spaceSigungu(region.secondDepth)}`.trim(),
    keyword: region.thirdDepth,
  };
}