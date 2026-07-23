export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
}

export const noticeList: Notice[] = [
  {
    id: '1',
    title: '서비스 점검 안내 (7월 25일)',
    date: '2025.06.20',
    content:
      '안녕하세요, AMOA입니다.\n\n서비스 품질 향상을 위해 아래와 같이 정기 점검을 진행합니다.\n\n· 점검 일시\n2025년 7월 25일(금) 02:00 ~ 05:00 (3시간)\n\n· 점검 내용\n- 서버 안정화 작업\n- 예약 시스템 개선\n\n점검 시간 동안에는 서비스 이용이 일시 중단됩니다.\n이용에 불편을 드려 죄송하며, 더 나은 서비스로 찾아뵙겠습니다.',
  },
  {
    id: '2',
    title: 'AMOA 서비스 오픈 안내',
    date: '2025.06.01',
    content:
      '안녕하세요, AMOA입니다.\n\nAMOA 서비스가 정식으로 오픈되었습니다.\n앞으로도 더 나은 서비스로 찾아뵙겠습니다. 많은 이용 부탁드립니다.',
  },
];
