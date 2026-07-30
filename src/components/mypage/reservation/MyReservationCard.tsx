// [F102] 예약 목록 카드
// 샵명, 아트명, 상태 뱃지 및 예약 금액 표시

import { useNavigate } from 'react-router-dom';

import {
  formatReservationDateLabel,
  getReservationDisplayStatus,
  type ReservationDisplayStatus,
  type ReservationListItem,
} from '../../../data/reservationAPI';

const STATUS_LABEL: Record<ReservationDisplayStatus, string> = {
  UPCOMING: '시술 예정',
  COMPLETED: '시술 완료',
  CANCELLED: '시술 취소',
};

interface MyReservationCardProps {
  reservation: ReservationListItem;
}

export default function MyReservationCard({
  reservation,
}: MyReservationCardProps) {
  const navigate = useNavigate();

  const status = getReservationDisplayStatus({
    reservationStatus: reservation.reservationStatus,
    reservationDate: reservation.reservationDate,
  });

  const isCancelled = status === 'CANCELLED';

  const isUpcoming = status === 'UPCOMING';

  const reservationDateLabel = formatReservationDateLabel(
    reservation.reservationDate,
    reservation.reservationStartTime,
  );

  const handleMoveToDetail = () => {
    navigate(`/reservations/${reservation.reservationId}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E9EBEE] bg-white">
      {/* 카드 내용 */}
      <div className="px-4 pb-4 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              isCancelled ? 'text-[#ADB0B5]' : 'text-[#171B1C]'
            }`}
          >
            {reservation.shopName}
          </span>

          <span
            className={`rounded-md px-2 py-1 text-[11px] ${
              isUpcoming
                ? 'bg-[#171B1C] text-white'
                : 'border border-[#D9DCE1] bg-white text-[#ADB0B5]'
            }`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <p
          className={`text-sm ${
            isCancelled ? 'text-[#C5C8CC]' : 'text-[#8B929C]'
          }`}
        >
          {reservation.artName}
        </p>

        <p
          className={`mt-1 text-xs ${
            isCancelled ? 'text-[#C5C8CC]' : 'text-[#ADB0B5]'
          }`}
        >
          {reservationDateLabel}
        </p>

        <p
          className={`mt-3 text-base font-bold ${
            isCancelled ? 'text-[#C5C8CC] line-through' : 'text-[#171B1C]'
          }`}
        >
          {reservation.totalPrice.toLocaleString()}원
        </p>
      </div>

      {/* 상세 보기 버튼 */}
      <button
        type="button"
        onClick={handleMoveToDetail}
        className="h-[50px] w-full cursor-pointer border-t border-[#E9EBEE] bg-white text-sm font-bold text-[#171B1C]"
      >
        상세 보기
      </button>
    </div>
  );
}
