// [F102] 내 예약 목록 화면 (월별 그룹핑 목록 조회 및 상태 뱃지 표시)

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import {
  getReservations,
  getReservationDateTime,
  type SavedReservation,
  seedMockReservations,
} from '../../data/reservationData';
import MyReservationCard from '../../components/mypage/reservation/MyReservationCard';

function getMonthGroupLabel(dateKey: string): string {
  const [y, m] = dateKey.split('-').map(Number);
  const now = new Date();
  const thisY = now.getFullYear();
  const thisM = now.getMonth() + 1;

  if (y === thisY && m === thisM) return '이번 달';

  let lastY = thisY;
  let lastM = thisM - 1;
  if (lastM === 0) {
    lastM = 12;
    lastY -= 1;
  }
  if (y === lastY && m === lastM) return '지난 달';

  return `${y}년 ${m}월`;
}

export default function MyReservationListPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<SavedReservation[]>([]);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const handleSeedMock = () => {
    seedMockReservations();
    setReservations(getReservations());
  };

  const grouped = useMemo(() => {
    const sorted = [...reservations].sort(
      (a, b) =>
        getReservationDateTime(b.date, b.time).getTime() -
        getReservationDateTime(a.date, a.time).getTime(),
    );

    const map = new Map<string, SavedReservation[]>();
    sorted.forEach((r) => {
      const label = getMonthGroupLabel(r.date);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(r);
    });
    return Array.from(map.entries());
  }, [reservations]);

  return (
    <div className="min-h-dvh bg-white">
      <div className="relative flex items-center justify-center px-4 py-3 border-b border-[#E9EBEE]">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-sm font-bold text-[#171B1C]">예약 내역</span>
      </div>

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <p className="text-sm text-[#ADB0B5]">아직 예약 내역이 없어요</p>
          <button
            onClick={() => navigate('/art-search')}
            className="mt-4 rounded-lg bg-[#171B1C] text-white px-5 py-2.5 text-sm cursor-pointer"
          >
            아트 둘러보러 가기
          </button>
          <button
            onClick={handleSeedMock}
            className="mt-3 text-xs text-[#ADB0B5] underline cursor-pointer"
          >
            (테스트) 예정/완료/취소 목업 예약 만들기
          </button>
        </div>
      ) : (
        <div className="px-5 py-5 flex flex-col gap-6">
          {grouped.map(([label, list]) => (
            <div key={label}>
              <p className="text-sm font-bold text-[#171B1C] mb-3">{label}</p>
              <div className="flex flex-col gap-3">
                {list.map((r) => (
                  <MyReservationCard key={r.id} reservation={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
