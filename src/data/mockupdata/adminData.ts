export type MoodTag = '심플' | '아기자기' | '화려' | '스트릿' | '유니크' | '내추럴' | '빈티지';

export type ArtType = '이달의 아트' | '지난달 아트' | '이벤트' | '원컬러';

export interface Shop {
  id: number;
  name: string;
  location: string;
  tags: MoodTag[];
  phone?: string;
  hours?: string;
}

export interface Art {
  id: number;
  shopName: string;
  artType: ArtType;
  priceMin: string;
  priceMax: string;
  tags: MoodTag[];
}

export const initialShops: Shop[] = [
  {
    id: 1,
    name: '미니숍네일',
    location: '서울 성동구 성수동',
    tags: ['심플', '내추럴'],
  },
  {
    id: 2,
    name: '뷰티네일',
    location: '서울 마포구 홍대입구',
    tags: ['화려', '아기자기'],
  },
];

export const initialArts: Art[] = [
  {
    id: 1,
    shopName: '미니숍네일',
    artType: '이달의 아트',
    priceMin: '40,000',
    priceMax: '70,000',
    tags: ['심플', '내추럴'],
  },
  {
    id: 2,
    shopName: '뷰티네일',
    artType: '이벤트',
    priceMin: '30,000',
    priceMax: '50,000',
    tags: ['화려', '아기자기'],
  },
]; 