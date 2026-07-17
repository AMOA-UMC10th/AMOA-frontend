//임시데이터

export type ArtType = 'MONTHLY' | 'EVENT' | 'NORMAL';

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
  "isSuccess": true,
  "code": "CARD200", 
  "message": "카드 조회에 성공했습니다.",
  "result": {
    "size": 23,
    "cards": [
      {
        "card_id": 1,
        "shop_name": "네일바이유",
        "instagram_url": "https://www.instagram.com/p/Dawf2YED2Io/",
        "art_type": "MONTHLY",
        "min_price": 58000,
        "max_price": 78000,
        "region_name": "송파구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 2,
        "shop_name": "블링하우스 네일",
        "instagram_url": "https://www.instagram.com/p/DQgk1VMEQd6/",
        "art_type": "EVENT",
        "min_price": 45000,
        "max_price": 60000,
        "region_name": "강남구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 3,
        "shop_name": "로즈네일 스튜디오",
        "instagram_url": "https://www.instagram.com/p/DXyPEfUFGuc/",
        "art_type": "NORMAL",
        "min_price": 50000,
        "max_price": 80000,
        "region_name": "성동구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 4,
        "shop_name": "네일디자인하우스",
        "instagram_url": "https://www.instagram.com/p/DY_5Zz6krYL/",
        "art_type": "MONTHLY",
        "min_price": 60000,
        "max_price": 90000,
        "region_name": "서초구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 5,
        "shop_name": "무드네일",
        "instagram_url": "https://www.instagram.com/p/DS7Zgc8kh3F/",
        "art_type": "EVENT",
        "min_price": 40000,
        "max_price": 55000,
        "region_name": "송파구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 6,
        "shop_name": "센스네일 숍",
        "instagram_url": "https://www.instagram.com/p/DY6y1Ibjwgx/",
        "art_type": "NORMAL",
        "min_price": 50000,
        "max_price": 70000,
        "region_name": "용산구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 7,
        "shop_name": "체리블라썸 네일",
        "instagram_url": "https://www.instagram.com/p/DaApiAxp2di/",
        "art_type": "MONTHLY",
        "min_price": 65000,
        "max_price": 85000,
        "region_name": "마포구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 8,
        "shop_name": "네일살롱 그레이스",
        "instagram_url": "https://www.instagram.com/p/DS5MHvTk0Cs/",
        "art_type": "EVENT",
        "min_price": 39000,
        "max_price": 49000,
        "region_name": "광진구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 9,
        "shop_name": "아뜰리에 네일",
        "instagram_url": "https://www.instagram.com/p/DaPnB1YTpl9/",
        "art_type": "MONTHLY",
        "min_price": 70000,
        "max_price": 100000,
        "region_name": "강남구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 10,
        "shop_name": "클래시 네일아트",
        "instagram_url": "https://www.instagram.com/p/DEUh3-nSV-j/",
        "art_type": "NORMAL",
        "min_price": 55000,
        "max_price": 75000,
        "region_name": "영등포구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 11,
        "shop_name": "네일프렌즈",
        "instagram_url": "https://www.instagram.com/p/DaKkNrNgRfy/",
        "art_type": "MONTHLY",
        "min_price": 59000,
        "max_price": 79000,
        "region_name": "성동구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 12,
        "shop_name": "뷰티인사이드 네일",
        "instagram_url": "https://www.instagram.com/p/DMtrmVVBR05/",
        "art_type": "EVENT",
        "min_price": 35000,
        "max_price": 50000,
        "region_name": "서대문구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 13,
        "shop_name": "르망 네일",
        "instagram_url": "https://www.instagram.com/p/DWc1X7TE9jw/",
        "art_type": "NORMAL",
        "min_price": 60000,
        "max_price": 80000,
        "region_name": "종로구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 14,
        "shop_name": "골든터치 네일",
        "instagram_url": "https://www.instagram.com/p/Dac2wS1lF4G/",
        "art_type": "MONTHLY",
        "min_price": 65000,
        "max_price": 85000,
        "region_name": "중구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 15,
        "shop_name": "블링클로버",
        "instagram_url": "https://www.instagram.com/p/DZ_ik1Jjz6N/",
        "art_type": "EVENT",
        "min_price": 45000,
        "max_price": 55000,
        "region_name": "동작구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 16,
        "shop_name": "샤인블링 네일",
        "instagram_url": "https://www.instagram.com/p/DacFyQDvvD-/",
        "art_type": "NORMAL",
        "min_price": 50000,
        "max_price": 70000,
        "region_name": "양천구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 17,
        "shop_name": "라라네일앤왁싱",
        "instagram_url": "https://www.instagram.com/p/DUSecKukpOg/",
        "art_type": "MONTHLY",
        "min_price": 55000,
        "max_price": 75000,
        "region_name": "은평구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 18,
        "shop_name": "스윗가든 네일",
        "instagram_url": "https://www.instagram.com/p/DaLJ9PUlOZG/",
        "art_type": "EVENT",
        "min_price": 38000,
        "max_price": 48000,
        "region_name": "강서구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 19,
        "shop_name": "네일더헤븐",
        "instagram_url": "https://www.instagram.com/p/DR7AwFzE6-6/",
        "art_type": "NORMAL",
        "min_price": 70000,
        "max_price": 95000,
        "region_name": "강남구",
        "created_month": "2026-07",
        "is_liked": true
      },
      {
        "card_id": 20,
        "shop_name": "프리즘 네일아트",
        "instagram_url": "https://www.instagram.com/p/DZ_ik1Jjz6N/",
        "art_type": "MONTHLY",
        "min_price": 60000,
        "max_price": 80000,
        "region_name": "구로구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 21,
        "shop_name": "컬러하이브",
        "instagram_url": "https://www.instagram.com/p/DY_5Zz6krYL/",
        "art_type": "EVENT",
        "min_price": 42000,
        "max_price": 55000,
        "region_name": "노원구",
        "created_month": "2026-07",
        "is_liked": false
      },
      {
        "card_id": 22,
        "shop_name": "멜로우 네일스튜디오",
        "instagram_url": "https://www.instagram.com/p/DaM-Prikvs2/",
        "art_type": "NORMAL",
        "min_price": 50000,
        "max_price": 70000,
        "region_name": "성북구",
        "created_month": "2026-07",
        "is_liked": true
      }
    ],
    "nextCursor": 23,
    "hasNext": false
  }
}
