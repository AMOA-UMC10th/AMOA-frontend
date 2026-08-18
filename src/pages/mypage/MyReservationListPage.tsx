// [F102] 내 예약 목록 화면

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import {
  getMyReservations,
  type ReservationListItem,
} from '../../data/reservationAPI';
import MyReservationCard from '../../components/mypage/reservation/MyReservationCard';
import Spinner from '../../components/common/Spinner';

const PAGE_SIZE = 10;

function getMonthGroupLabel(dateKey: string): string {
  const [year, month] = dateKey.split('-').map(Number);

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;

  // 다음 달 계산
  let nextYear = thisYear;
  let nextMonth = thisMonth + 1;

  if (nextMonth === 13) {
    nextMonth = 1;
    nextYear += 1;
  }

  // 지난 달 계산
  let lastYear = thisYear;
  let lastMonth = thisMonth - 1;

  if (lastMonth === 0) {
    lastMonth = 12;
    lastYear -= 1;
  }

  if (year === nextYear && month === nextMonth) {
    return '다음달';
  }

  if (year === thisYear && month === thisMonth) {
    return '이번달';
  }

  if (year === lastYear && month === lastMonth) {
    return '지난달';
  }

  return `${String(year).slice(-2)}년 ${month}월`;
}

export default function MyReservationListPage() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [requestSize, setRequestSize] = useState(PAGE_SIZE);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const previousResultLengthRef = useRef(0);

  const fetchReservations = useCallback(
    async (size: number, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage(null);

        const result = await getMyReservations(size);
        setReservations(result);

        if (result.length < size) {
          setHasMore(false);
        } else if (
          isLoadMore &&
          result.length === previousResultLengthRef.current
        ) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        previousResultLengthRef.current = result.length;
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '예약 내역을 불러오지 못했어요.',
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // 최초 예약 목록 조회
  useEffect(() => {
    fetchReservations(PAGE_SIZE);
  }, [fetchReservations]);

  // 스크롤로 requestSize가 증가하면 더 많은 예약 조회
  useEffect(() => {
    if (requestSize === PAGE_SIZE) return;

    fetchReservations(requestSize, true);
  }, [requestSize, fetchReservations]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore || !hasMore) return;

      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];

          if (firstEntry.isIntersecting) {
            setRequestSize((prev) => prev + PAGE_SIZE);
          }
        },
        {
          root: null,
          rootMargin: '200px',
          threshold: 0,
        },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMore, isLoading, isLoadingMore],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
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

  const handleRetry = () => {
    previousResultLengthRef.current = 0;
    setRequestSize(PAGE_SIZE);
    setHasMore(true);
    fetchReservations(PAGE_SIZE);
  };

  return (
    <div className="min-h-dvh bg-white">
      <div className="sticky relative top-0 z-10 flex items-center justify-center bg-white gap-[15px] border-b border-[#E9EBEE] h-[50px]">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="absolute left-[14px] cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-6 w-6 text-[#646F7C]" />
        </button>

        <span className="text-[13px] font-semibold text-[#000000]">
          예약 내역
        </span>
      </div>

      {isLoading ? (
        <div className="flex h-[calc(100vh-50px)] items-center justify-center">
          <Spinner size={20} ariaLabel="예약 내역 불러오는 중" />
        </div>
      ) : errorMessage && reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24">
          <p className="text-center text-sm text-[#ADB0B5]">{errorMessage}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 cursor-pointer rounded-lg bg-[#171B1C] px-5 py-2.5 text-sm text-white"
          >
            다시 시도
          </button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="flex h-[calc(100dvh-50px)] items-center justify-center bg-white">
          <div className="flex w-[163px] flex-col items-center text-center">
            <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#FFF0F7]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3.5"
                  y="5.5"
                  width="17"
                  height="15"
                  rx="2"
                  stroke="#F70071"
                  strokeWidth="1.8"
                />
                <path
                  d="M7 3.5V7.5"
                  stroke="#F70071"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M17 3.5V7.5"
                  stroke="#F70071"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path d="M3.5 10H20.5" stroke="#F70071" strokeWidth="1.8" />
              </svg>
            </div>

            <p className="mt-[16px] w-full text-[15px] font-semibold leading-[23px] text-[#171B1C]">
              예약 내역이 없어요
            </p>

            <p className="mt-[6px] whitespace-nowrap text-[11px] font-medium leading-[17px] text-[#ADB0B5]">
              마음에 드는 아트를 지금 예약해보세요
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col px-[15px]">
            {grouped.map(([label, list]) => {
              const isPinkMonth = label === '이번달' || label === '다음달';
              return (
                <section key={label}>
                  <p className="mt-[21px] mb-[6px] text-[11px] font-medium text-[#ADB0B5]">
                    {label}
                  </p>

                  <div className="flex flex-col gap-[14px]">
                    {list.map((reservation) => (
                      <MyReservationCard
                        key={reservation.reservationId}
                        reservation={reservation}
                        isThisMonth={isPinkMonth}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* 무한스크롤 감지 영역 */}
          {hasMore && (
            <div
              ref={loadMoreRef}
              className="flex h-20 items-center justify-center"
            >
              {isLoadingMore && (
                <Spinner size={20} ariaLabel="예약 내역 추가로 불러오는 중" />
              )}
            </div>
          )}

          {!hasMore && reservations.length > PAGE_SIZE && (
            <p className="pb-8 text-center text-xs text-[#ADB0B5]">
              모든 예약 내역을 불러왔어요
            </p>
          )}

          {errorMessage && reservations.length > 0 && (
            <div className="flex flex-col items-center px-5 pb-8">
              <p className="text-center text-xs text-[#ADB0B5]">
                추가 예약 내역을 불러오지 못했어요.
              </p>

              <button
                type="button"
                onClick={() => fetchReservations(requestSize, true)}
                className="mt-3 cursor-pointer text-xs font-semibold text-[#F70071]"
              >
                다시 시도
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
