export interface DesignTag {
  designtag_id: number;
  name: string;
}

export interface ShopDetailResult {
  shop_id: number;
  shop_name: string;
  is_liked: boolean;
  profile_image_url: string | null;
  kakao_channel_url: string;
  instagram_url: string;
  address: string;
  latitude: number;
  longitude: number;
  shop_phone_number: string;
  business_hours: string;
  shop_status: string;
  designtags: DesignTag[];
  card_like_count: number; // 아트찜 수 (시안의 '2만')
  shop_like_count: number; // 샵찜 수 (시안의 '3만')
  created_at: string;
  updated_at: string;
}

export interface ShopDetailResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: ShopDetailResult;
}

export interface NailCardItem {
  card_id: number;
  nail_image_url: string | null;
  instagram_url: string;
  region_name: string;
  min_price: number;
  max_price: number;
  art_type: string;
  is_liked: boolean;
}

export interface CardListResult {
  shop_id: number;
  shop_name: string;
  total_count: number;
  page: number;
  size: number;
  cards: NailCardItem[];
}

export interface CardListResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: CardListResult;
}

export const mockShopDetailData: ShopDetailResponse = {
  "isSuccess": true,
  "code": 200,
  "message": "샵 상세 조회 성공",
  "result": {
    "shop_id": 1,
    "shop_name": "네코르 네일",
    "is_liked": true,
    "profile_image_url": null,
    "kakao_channel_url": "https://pf.kakao.com/_xABCDE",
    "instagram_url": "https://www.instagram.com/nekorunail",
    "address": "부산 부산진구 가야대로 754 106호",
    "latitude": 35.1568285,
    "longitude": 129.0520282,
    "shop_phone_number": "010-0000-0000",
    "business_hours": "월~금 9:00-18:00",
    "shop_status": "ACTIVE",
    "designtags": [
      { "designtag_id": 1, "name": "유니크" },
      { "designtag_id": 2, "name": "화려" }
    ],
    "card_like_count": 20000, // 2만
    "shop_like_count": 30000,  // 3만
    "created_at": "2026-07-03T00:00:00",
    "updated_at": "2026-07-03T00:00:00"
  }
};

export const mockCardListData: CardListResponse = {
  "isSuccess": true,
  "code": 200,
  "message": "카드 목록 조회 성공",
  "result": {
    "shop_id": 1,
    "shop_name": "네코르 네일",
    "total_count": 3,
    "page": 0,
    "size": 6,
    "cards": [
      {
        "card_id": 1,
        "nail_image_url": null,
        "instagram_url": "https://www.instagram.com/p/DXwdY3KEqfM/",
        "region_name": "부전동",
        "min_price": 40000,
        "max_price": 70000,
        "art_type": "MONTHLY",
        "is_liked": false
      },
      {
        "card_id": 2,
        "nail_image_url": null,
        "instagram_url": "https://www.instagram.com/p/DY_5Zz6krYL/",
        "region_name": "부전동",
        "min_price": 40000,
        "max_price": 70000,
        "art_type": "MONTHLY",
        "is_liked": true
      },
      {
        "card_id": 3,
        "nail_image_url": null,
        "instagram_url": "https://www.instagram.com/p/DVS7jZFEtcS/",
        "region_name": "부전동",
        "min_price": 40000,
        "max_price": 70000,
        "art_type": "MONTHLY",
        "is_liked": false
      }
    ]
  }
};