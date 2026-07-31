// [F103] 예약 상세 내역 및 취소 화면
// 상태별 버튼 및 실제 예약 API 연동

import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { ChevronLeftIcon } from '../../assets/icons';

import ReservationDetailCard from '../../components/mypage/reservation/ReservationDetailCard';
import BookerInfoSection from '../../components/mypage/reservation/BookerInfoSection';
import CancelConfirmModal from '../../components/mypage/reservation/CancelConfirmModal';
import KakaoMoveModal from '../../components/art_detail/KakaoMoveModal';

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

  const handleConfirmCancel = async () => {
    if (!reservation || isCancelling) {
      return;
    }

    try {
      setIsCancelling(true);

      await cancelMyReservation(reservation.reservationId);

      setShowCancelModal(false);
      setJustCancelled(true);

      window.setTimeout(() => {
        navigate('/reservations', {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error('예약 취소 실패:', error);

      alert(error instanceof Error ? error.message : '예약 취소에 실패했어요.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOpenKakao = () => {
    if (!reservation) return;

    if (reservation.kakaoChannelUrl) {
      window.open(reservation.kakaoChannelUrl, '_blank', 'noopener,noreferrer');

      return;
    }

    setShowKakaoModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <p className="text-sm text-[#ADB0B5]">예약 정보를 불러오는 중이에요</p>
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
      <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F70071]">
          <svg
            width="30"
            height="30"
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

        <h1 className="mt-6 text-[20px] font-semibold text-[#171B1C]">
          취소완료
        </h1>

        <p className="mt-2 text-[16px] font-medium text-[#ADB0B5]">
          취소가 완료되었어요
        </p>
      </div>
    );
  }

  const status = getReservationDisplayStatus({
    reservationStatus: reservation.reservationStatus,
    reservationDate: reservation.reservationDate,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {/* 헤더 */}
      <header className="relative flex h-[64px] shrink-0 items-center border-b border-[#E9EBEE] px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-8 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="size-5 text-[#171B1C]" />
        </button>

        <h1 className="ml-1 text-base font-bold text-[#171B1C]">예약 내역</h1>
      </header>

      {/* 상세 내용 */}
      <main className="flex-1 px-5 pb-8 pt-5">
        <div>
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] ${
              status === 'UPCOMING'
                ? 'bg-[#171B1C] text-white'
                : 'border border-[#CCCCCC] bg-white text-[#A9A9A9]'
            }`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <div className="mt-6">
          <ReservationDetailCard reservation={reservation} />
        </div>

        <BookerInfoSection reservation={reservation} />
      </main>

      {/* 하단 버튼 */}
      <footer className="shrink-0 bg-white px-5 pb-7 pt-3">
        {status === 'UPCOMING' && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={isCancelling}
              className="h-[60px] flex-1 cursor-pointer rounded-xl border-[1.5px] border-[#888888] bg-white text-base font-bold text-[#888888] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling ? '취소 중' : '예약 취소'}
            </button>

            <button
              type="button"
              onClick={handleOpenKakao}
              className="h-[60px] flex-1 cursor-pointer rounded-xl bg-black text-base font-bold text-white"
            >
              카카오톡 문의
            </button>
          </div>
        )}

        {status === 'COMPLETED' && (
          <button
            type="button"
            onClick={() => navigate('/art-search')}
            className="h-[60px] w-full cursor-pointer rounded-xl bg-black text-base font-bold text-white"
          >
            다른 시술 예약하러 가기
          </button>
        )}

        {status === 'CANCELLED' && (
          <button
            type="button"
            onClick={() => navigate('/art-search')}
            className="h-[60px] w-full cursor-pointer rounded-xl bg-black text-base font-bold text-white"
          >
            다시 예약하기
          </button>
        )}
      </footer>

      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          if (!isCancelling) {
            setShowCancelModal(false);
          }
        }}
        onConfirm={handleConfirmCancel}
      />

      <KakaoMoveModal
        isOpen={showKakaoModal}
        onClose={() => setShowKakaoModal(false)}
        shopName={reservation.shopName}
      />
    </div>
  );
}
