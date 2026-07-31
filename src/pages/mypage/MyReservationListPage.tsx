// [F102] 내 예약 목록 화면

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import {
  getMyReservations,
  type ReservationListItem,
} from '../../data/reservationAPI';
import MyReservationCard from '../../components/mypage/reservation/MyReservationCard';

function getMonthGroupLabel(dateKey: string): string {
  const [year, month] = dateKey.split('-').map(Number);
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;

  if (year === thisYear && month === thisMonth) return '이번 달';

  let lastYear = thisYear;
  let lastMonth = thisMonth - 1;

  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear -= 1;
  }

  if (year === lastYear && month === lastMonth) return '지난 달';

  return `${year}년 ${month}월`;
}

export default function MyReservationListPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await getMyReservations(10);
        if (isMounted) setReservations(result);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '예약 내역을 불러오지 못했어요.',
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReservations();

    return () => {
      isMounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, ReservationListItem[]>();

    reservations.forEach((reservation) => {
      const label = getMonthGroupLabel(reservation.reservationDate);
      const group = map.get(label) ?? [];
      group.push(reservation);
      map.set(label, group);
    });

    return Array.from(map.entries());
  }, [reservations]);

  return (
    <div className="min-h-dvh bg-white">
      <div className="relative flex items-center justify-center border-b border-[#E9EBEE] px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5 text-[#171B1C]" />
        </button>
        <span className="text-sm font-bold text-[#171B1C]">예약 내역</span>
      </div>

      {isLoading ? (
        <div className="flex min-h-[70vh] items-center justify-center">
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#E9EBEE] border-t-[#F70071]"
            role="status"
            aria-label="예약 내역 불러오는 중"
          />
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center justify-center px-6 py-24">
          <p className="text-center text-sm text-[#ADB0B5]">{errorMessage}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 cursor-pointer rounded-lg bg-[#171B1C] px-5 py-2.5 text-sm text-white"
          >
            다시 시도
          </button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24">
          <p className="text-sm text-[#ADB0B5]">아직 예약 내역이 없어요</p>
          <button
            type="button"
            onClick={() => navigate('/art-search')}
            className="mt-4 cursor-pointer rounded-lg bg-[#171B1C] px-5 py-2.5 text-sm text-white"
          >
            아트 둘러보러 가기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-5 py-5">
          {grouped.map(([label, list]) => (
            <div key={label}>
              <p className="mb-3 text-sm font-bold text-[#171B1C]">{label}</p>
              <div className="flex flex-col gap-3">
                {list.map((reservation) => (
                  <MyReservationCard
                    key={reservation.reservationId}
                    reservation={reservation}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
