//임시데이터

export type ArtType = 'MONTHLY' | 'EVENT';

export interface NailCard {
  card_id: number;
  shop_name: string;
  instagram_url: string;
  art_type: ArtType;
  min_price: number;
  max_price: number;
  region_name: string;
  created_month: string;
  is_liked: boolean;
}

export interface CardListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    size: number;
    cards: NailCard[];
    nextCursor: number;
    hasNext: boolean;
  };
}

export const mockCardResponse: CardListResponse = {
  isSuccess: true,
  code: "CARD200",
  message: "카드 조회에 성공했습니다.",
  result: {
    size: 12,
    cards: [
      {
        card_id: 1,
        shop_name: "네일 가비",
        instagram_url: "https://www.instagram.com/p/DaXa3YCkdKU/",
        art_type: "MONTHLY",
        min_price: 45000,
        max_price: 60000,
        region_name: "마포구",
        created_month: "2026-07",
        is_liked: false
      },
      {
        card_id: 2,
        shop_name: "네일포시즌 홍대점",
        instagram_url: "https://www.instagram.com/p/DZ_vF4dD0eA/",
        art_type: "MONTHLY",
        min_price: 40000,
        max_price: 50000,
        region_name: "마포구",
        created_month: "2026-07",
        is_liked: false
      },
      {
        card_id: 3,
        shop_name: "네일가비 성수점",
        instagram_url: "https://www.instagram.com/p/DaXa3YCkdKU/", 
        art_type: "EVENT",
        min_price: 35000,
        max_price: 50000,
        region_name: "성동구",
        created_month: "2026-07",
        is_liked: true
      },
      {
        card_id: 4,
        shop_name: "네일 아틀리에",
        instagram_url: "https://www.instagram.com/p/DQgk1VMEQd6/",
        art_type: "MONTHLY",
        min_price: 50000,
        max_price: 70000,
        region_name: "강남구",
        created_month: "2026-07",
        is_liked: false
      },
      {
        card_id: 5,
        shop_name: "포레스트 네일",
        instagram_url: "https://www.instagram.com/p/DXyPEfUFGuc/",
        art_type: "MONTHLY",
        min_price: 45000,
        max_price: 55000,
        region_name: "마포구",
        created_month: "2026-08",
        is_liked: false
      },
      {
        card_id: 6,
        shop_name: "뮤즈 네일샵",
        instagram_url: "https://www.instagram.com/p/DY_5Zz6krYL/",
        art_type: "EVENT",
        min_price: 30000,
        max_price: 40000,
        region_name: "성동구",
        created_month: "2026-08",
        is_liked: false
      },
      {
        card_id: 7,
        shop_name: "블라썸 네일",
        instagram_url: "https://www.instagram.com/p/DS7Zgc8kh3F/",
        art_type: "MONTHLY",
        min_price: 55000,
        max_price: 65000,
        region_name: "강남구",
        created_month: "2026-08",
        is_liked: true
      },
      {
        card_id: 8,
        shop_name: "르네 네일",
        instagram_url: "https://www.instagram.com/p/DY6y1Ibjwgx/",
        art_type: "MONTHLY",
        min_price: 45000,
        max_price: 60000,
        region_name: "마포구",
        created_month: "2026-08",
        is_liked: false
      },
      {
        card_id: 9,
        shop_name: "헤이즐 네일",
        instagram_url: "https://www.instagram.com/p/DaApiAxp2di/",
        art_type: "EVENT",
        min_price: 39000,
        max_price: 49000,
        region_name: "성동구",
        created_month: "2026-08",
        is_liked: false
      },
      {
        card_id: 10,
        shop_name: "그린네일 스튜디오",
        instagram_url: "https://www.instagram.com/p/DS5MHvTk0Cs/",
        art_type: "MONTHLY",
        min_price: 40000,
        max_price: 55000,
        region_name: "마포구",
        created_month: "2026-08",
        is_liked: false
      },
      {
        card_id: 11,
        shop_name: "벨라 뷰티",
        instagram_url: "https://www.instagram.com/p/DaPnB1YTpl9/",
        art_type: "MONTHLY",
        min_price: 50000,
        max_price: 70000,
        region_name: "강남구",
        created_month: "2026-08",
        is_liked: true
      },
      {
        card_id: 12,
        shop_name: "오즈 네일",
        instagram_url: "https://www.instagram.com/p/DEUh3-nSV-j/",
        art_type: "EVENT",
        min_price: 35000,
        max_price: 45000,
        region_name: "성동구",
        created_month: "2026-08",
        is_liked: false
      }
    ],
    "nextCursor": 12,
    "hasNext": false
  }
};