export interface RegionMatch {
  id: string;
  keyword: string;
  district: string;
  shortDistrict: string;
}

const REGION_MOCK: RegionMatch[] = [
  { id: '1', keyword: '강남구', district: '서울시 강남구', shortDistrict: '강남구' },
  { id: '2', keyword: '강동구', district: '서울시 강동구', shortDistrict: '강동구' },
  { id: '3', keyword: '강북구', district: '서울시 강북구', shortDistrict: '강북구' },
  { id: '4', keyword: '강서구', district: '서울시 강서구', shortDistrict: '강서구' },
  { id: '5', keyword: '관악구', district: '서울시 관악구', shortDistrict: '관악구' },
  { id: '6', keyword: '광진구', district: '서울시 광진구', shortDistrict: '광진구' },
  { id: '7', keyword: '구로구', district: '서울시 구로구', shortDistrict: '구로구' },
  { id: '8', keyword: '금천구', district: '서울시 금천구', shortDistrict: '금천구' },
  { id: '9', keyword: '노원구', district: '서울시 노원구', shortDistrict: '노원구' },
  { id: '10', keyword: '도봉구', district: '서울시 도봉구', shortDistrict: '도봉구' },
  { id: '11', keyword: '동대문구', district: '서울시 동대문구', shortDistrict: '동대문구' },
  { id: '12', keyword: '동작구', district: '서울시 동작구', shortDistrict: '동작구' },
  { id: '13', keyword: '마포구', district: '서울시 마포구', shortDistrict: '마포구' },
  { id: '14', keyword: '서대문구', district: '서울시 서대문구', shortDistrict: '서대문구' },
  { id: '15', keyword: '서초구', district: '서울시 서초구', shortDistrict: '서초구' },
  { id: '16', keyword: '성동구', district: '서울시 성동구', shortDistrict: '성동구' },
  { id: '17', keyword: '성북구', district: '서울시 성북구', shortDistrict: '성북구' },
  { id: '18', keyword: '송파구', district: '서울시 송파구', shortDistrict: '송파구' },
  { id: '19', keyword: '양천구', district: '서울시 양천구', shortDistrict: '양천구' },
  { id: '20', keyword: '영등포구', district: '서울시 영등포구', shortDistrict: '영등포구' },
  { id: '21', keyword: '용산구', district: '서울시 용산구', shortDistrict: '용산구' },
  { id: '22', keyword: '은평구', district: '서울시 은평구', shortDistrict: '은평구' },
  { id: '23', keyword: '종로구', district: '서울시 종로구', shortDistrict: '종로구' },
  { id: '24', keyword: '중구', district: '서울시 중구', shortDistrict: '중구' },
  { id: '25', keyword: '중랑구', district: '서울시 중랑구', shortDistrict: '중랑구' }
];

export function searchRegions(query: string): RegionMatch[] {
  const q = query.trim();
  if (!q) return [];
  return REGION_MOCK.filter(
    (r) => r.keyword.includes(q) || r.district.includes(q) || r.shortDistrict.includes(q)
  );
}

export const MOCK_CURRENT_LOCATION = {
  fullAddress: '서울 성동구 성수동2가',
  shortDistrict: '성동구',
  latitude: 37.5446,
  longitude: 127.0557,
};