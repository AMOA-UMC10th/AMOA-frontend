// A103 관심 지역 검색용 목업 데이터 (추후 실제 지역 검색 API로 교체)

export interface RegionMatch {
  id: string;
  keyword: string;
  district: string;
  shortDistrict: string;
}

const REGION_MOCK: RegionMatch[] = [
  { id: "1", keyword: "청파동", district: "서울시 용산구", shortDistrict: "용산구" },
  { id: "2", keyword: "후암동", district: "서울시 용산구", shortDistrict: "용산구" },
  { id: "3", keyword: "회현동", district: "서울시 중구", shortDistrict: "중구" },
  { id: "4", keyword: "명동", district: "서울시 중구", shortDistrict: "중구" },
  { id: "5", keyword: "역삼동", district: "서울시 강남구", shortDistrict: "강남구" },
  { id: "6", keyword: "강남역", district: "서울시 강남구", shortDistrict: "강남구" },
  { id: "7", keyword: "성수동1가", district: "서울시 성동구", shortDistrict: "성동구" },
  { id: "8", keyword: "성수동2가", district: "서울시 성동구", shortDistrict: "성동구" },
  { id: "9", keyword: "잠실동", district: "서울시 송파구", shortDistrict: "송파구" },
  { id: "10", keyword: "홍대입구역", district: "서울시 마포구", shortDistrict: "마포구" },
  { id: "11", keyword: "종각역", district: "서울시 종로구", shortDistrict: "종로구" },
  { id: "12", keyword: "화정동", district: "고양시 덕양구", shortDistrict: "덕양구" },
  { id: "13", keyword: "화정동", district: "광주광역시 광산구", shortDistrict: "광산구" },
];

export function searchRegions(query: string): RegionMatch[] {
  const q = query.trim();
  if (!q) return [];
  return REGION_MOCK.filter(
    (r) => r.keyword.includes(q) || r.district.includes(q)
  );
}

export const MOCK_CURRENT_LOCATION = {
  fullAddress: "서울 성동구 성수동2가",
  shortDistrict: "성동구",
};
