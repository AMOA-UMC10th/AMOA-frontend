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
  isThisMonth?: boolean;
}

export default function MyReservationCard({
  reservation,
  isThisMonth = false,
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
    <div
      className={`rounded-[15px] pt-[12px] pb-[14px] pl-[17px] pr-[11px] py-[26px] ${
        isThisMonth ? 'bg-[#FFF3F8]' : 'bg-[#F7F8F9]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[10px]">
            <span className={`text-[13px] font-semibold`}>
              {reservation.shopName}
            </span>

            <span
              className={`rounded-[3px] px-[6px] py-[1px] text-[12px] ${
                isUpcoming
                  ? 'bg-[#171B1C] text-white'
                  : 'bg-[#ADB0B5] text-white'
              }`}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>

          <p className={`mt-[10px] text-[11px] text-[#ADB0B5]`}>
            {reservation.artName}
          </p>

          <p className={`mt-[4px] text-[11px] text-[#ADB0B5]`}>
            {reservationDateLabel}
          </p>

          <p className={`mt-[4px] text-[13px] font-semibold`}>
            {reservation.totalPrice.toLocaleString()}원
          </p>
        </div>

        <button
          type="button"
          onClick={handleMoveToDetail}
          className="flex shrink-0 h-[18px] cursor-pointer items-center text-[10px] font-medium text-[#646F7C]"
        >
          <span>상세보기</span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.75 5.06L11.25 9L6.75 12.94"
              stroke="currentColor"
              strokeWidth="1.13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
