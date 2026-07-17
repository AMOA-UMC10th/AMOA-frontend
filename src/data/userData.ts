export interface SettingResult {
  profileImageUrl: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  marketingAgreed: boolean;
  preferredMoods: string[];
  interestedRegions: string[];
}

export interface SettingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SettingResult;
}

export const mockSettingData: SettingResponse = {
  isSuccess: true,
  code: "SETTING200",
  message: "설정 조회에 성공했습니다.",
  result: {
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
    nickname: "두두",
    email: "kinbee@gmail.com",
    phoneNumber: "01012345678",
    marketingAgreed: false,
    preferredMoods: ["SIMPLE", "UNIQUE"],
    interestedRegions: ["서울특별시 강남구", "서울특별시 성동구"]
  }
};