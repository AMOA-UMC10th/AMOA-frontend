// [F103] 예약 상세 내역 및 취소/재예약 화면
// 상태별 버튼 및 취소일 표시

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';

import ReservationDetailCard from '../../components/mypage/reservation/ReservationDetailCard';
import BookerInfoSection from '../../components/mypage/reservation/BookerInfoSection';
import CancelConfirmModal from '../../components/mypage/reservation/CancelConfirmModal';
import KakaoMoveModal from '../../components/art_detail/KakaoMoveModal';

import {
  getReservationById,
  cancelReservation,
  getDisplayStatus,
  formatCancelledDateLabel,
  type SavedReservation,
  type DisplayStatus,
} from '../../data/mockupdata/reservationData';

const STATUS_LABEL: Record<DisplayStatus, string> = {
  UPCOMING: '시술 예정',
  COMPLETED: '시술 완료',
  CANCELLED: '시술 취소',
};

export default function MyReservationDetailPage() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState<
    SavedReservation | null | undefined
  >(undefined);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showKakaoModal, setShowKakaoModal] = useState(false);
  const [justCancelled, setJustCancelled] = useState(false);

  useEffect(() => {
    const foundReservation = getReservationById(reservationId ?? '');

    setReservation(foundReservation ?? null);
  }, [reservationId]);

  const handleConfirmCancel = () => {
    if (!reservation) return;

    cancelReservation(reservation.id);
    setShowCancelModal(false);
    setJustCancelled(true);

    window.setTimeout(() => {
      navigate('/reservations');
    }, 1200);
  };

  if (reservation === undefined) {
    return null;
  }

  if (reservation === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <p className="text-sm text-[#ADB0B5]">예약 정보를 찾을 수 없어요</p>

        <button
          type="button"
          onClick={() => navigate('/reservations')}
          className="mt-4 cursor-pointer rounded-lg bg-[#171B1C] px-5 py-2.5 text-sm text-white"
        >
          예약 내역으로
        </button>
      </div>
    );
  }

  if (justCancelled) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
        {/* 체크 아이콘 */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F70071]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13L10 18L19 9"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 제목 */}
        <h1 className="mt-6 text-[20px] font-semibold text-[#171B1C]">
          취소완료
        </h1>

        {/* 설명 */}
        <p className="mt-2 text-[16px] font-medium text-[#ADB0B5]">
          취소가 완료되었어요
        </p>
      </div>
    );
  }

  const status = getDisplayStatus(reservation);

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
          {/* 
          {status === 'CANCELLED' && reservation.cancelledAt && (
            <p className="mt-2 text-xs text-[#ADB0B5]">
              {formatCancelledDateLabel(reservation.cancelledAt)}에 취소됨
            </p>
          )}*/}
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
              className="h-[60px] flex-1 cursor-pointer rounded-xl border border-[#888888] border-[1.5px] bg-white text-base font-bold text-[#888888]"
            >
              예약 취소
            </button>

            <button
              type="button"
              onClick={() => setShowKakaoModal(true)}
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
            onClick={() => navigate(`/art/${reservation.cardId}/reservation`)}
            className="h-[60px] w-full cursor-pointer rounded-xl bg-black text-base font-bold text-white"
          >
            다시 예약하기
          </button>
        )}
      </footer>

      <CancelConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
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
