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