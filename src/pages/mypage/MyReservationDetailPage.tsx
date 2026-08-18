// [F103] 예약 상세 내역 및 취소 화면
// 상태별 버튼 및 실제 예약 API 연동

import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { ChevronLeftIcon } from '../../assets/icons';

import ReservationDetailCard from '../../components/mypage/reservation/ReservationDetailCard';
import BookerInfoSection from '../../components/mypage/reservation/BookerInfoSection';
import CancelConfirmModal from '../../components/mypage/reservation/CancelConfirmModal';
import Spinner from '../../components/common/Spinner';
import {
  cancelMyReservation,
  getMyReservationDetail,
  getReservationDisplayStatus,
  type ReservationDetail,
  type ReservationDisplayStatus,
} from '../../data/reservationAPI';

const STATUS_LABEL: Record<ReservationDisplayStatus, string> = {
  UPCOMING: '시술 예정',
  COMPLETED: '시술 완료',
  CANCELLED: '시술 취소',
};

export default function MyReservationDetailPage() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState<ReservationDetail | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showKakaoModal, setShowKakaoModal] = useState(false);

  const [justCancelled, setJustCancelled] = useState(false);

  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const numericReservationId = Number(reservationId);

    if (!reservationId || Number.isNaN(numericReservationId)) {
      setErrorMessage('올바르지 않은 예약 정보예요.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchReservationDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await getMyReservationDetail(numericReservationId);

        console.log('예약 상세 API 응답:', result);

        if (!isMounted) return;

        setReservation(result);
      } catch (error) {
        console.error('예약 상세 조회 실패:', error);

        if (!isMounted) return;

        setReservation(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '예약 정보를 불러오지 못했어요.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReservationDetail();

    return () => {
      isMounted = false;
    };
  }, [reservationId]);

  useEffect(() => {
    if (!justCancelled) return;

    const timer = window.setTimeout(() => {
      navigate('/mypage/reservations', { replace: true });
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [justCancelled, navigate]);

  const handleConfirmCancel = async () => {
    if (!reservation || isCancelling) {
      return;
    }

    try {
      setIsCancelling(true);

      await cancelMyReservation(reservation.reservationId);

      setShowCancelModal(false);
      setJustCancelled(true);
    } catch (error) {
      console.error('예약 취소 실패:', error);

      alert(error instanceof Error ? error.message : '예약 취소에 실패했어요.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[9px] flex h-6 w-6 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 6.75L9 12L15 17.25"
                stroke="#646F7C"
                strokeWidth="1.13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h1 className="text-[13px] font-semibold text-[#000000]">
            예약 내역
          </h1>
        </header>

        {/* 헤더를 제외한 영역의 정중앙 */}
        <div className="flex h-[calc(100dvh-50px)] items-center justify-center">
          <Spinner size={20} ariaLabel="예약 상세 정보 불러오는 중" />
        </div>
      </div>
    );
  }

  if (errorMessage || !reservation) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6">
        <p className="text-center text-sm text-[#ADB0B5]">
          {errorMessage || '예약 정보를 찾을 수 없어요.'}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/reservations', {
              replace: true,
            })
          }
          className="mt-4 cursor-pointer rounded-lg bg-[#171B1C] px-5 py-2.5 text-sm font-medium text-white"
        >
          예약 내역으로
        </button>
      </div>
    );
  }

  if (justCancelled) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <div className="flex flex-1 items-center justify-center px-[24px]">
          <div className="flex flex-col items-center">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#F70071]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 13L10 18L19 9"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="mt-[9px] text-[23px] font-semibold leading-[35px] text-[#171B1C]">
              취소완료
            </h1>

            <p className="mt-[9px] text-[15px] font-medium leading-[23px] text-[#818B98]">
              취소가 완료되었어요
            </p>
          </div>
        </div>

        <footer className="bg-white px-[15px] pb-[28px]">
          <button
            type="button"
            onClick={() =>
              navigate('/mypage/reservations', {
                replace: true,
              })
            }
            className="flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#F70071] text-[15px] font-semibold text-white"
          >
            예약내역으로
          </button>
        </footer>
      </div>
    );
  }

  const status = getReservationDisplayStatus({
    reservationStatus: reservation.reservationStatus,
    reservationDate: reservation.reservationDate,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] bg-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-[9px] flex h-6 w-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 6.75L9 12L15 17.25"
              stroke="#646F7C"
              strokeWidth="1.13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1 className="text-[13px] font-semibold text-[#000000]">예약 내역</h1>
      </header>

      {/* 상세 내용 */}
      <main className="flex-1 px-[15px] pt-[22px]">
        <h2 className="text-[17px] font-semibold text-[#000000]">예약 정보</h2>

        {/* ① 예약자 정보 */}
        <div className="mt-[25px]">
          <BookerInfoSection reservation={reservation} />
        </div>

        {/* ② 예약 상세 정보 */}
        <div className="mt-[25px]">
          <ReservationDetailCard reservation={reservation} />
        </div>
      </main>

      {/* 하단 버튼 */}
      {status !== 'CANCELLED' && (
        <footer className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white px-[24px] pb-[28px]">
          {status === 'UPCOMING' && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={isCancelling}
              className="flex h-[52px] w-full items-center justify-center rounded-[10px] border border-[#F70071] bg-white text-[15px] font-medium text-[#F70071] disabled:cursor-not-allowed disabled:opacity-50"
            >
              예약 취소
            </button>
          )}

          {status === 'COMPLETED' && (
            <button
              type="button"
              onClick={() =>
                /*navigate(`/reviews/write/${reservation.reservationId}`*/
                alert('구현 중인 페이지 입니다.')
              }
              className="flex h-[52px] w-full items-center justify-center rounded-[10px] border border-[#F70071] bg-white text-[15px] font-medium text-[#F70071]"
            >
              리뷰 쓰기
            </button>
          )}
        </footer>
      )}

      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          if (!isCancelling) {
            setShowCancelModal(false);
          }
        }}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />
    </div>
  );
}
