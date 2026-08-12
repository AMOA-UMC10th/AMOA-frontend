import {
  formatReservationDateLabel,
  getReservationDisplayStatus,
  type ReservationDetail,
  type ReservationDisplayStatus,
} from '../../../data/reservationAPI';

interface ReservationDetailCardProps {
  reservation: ReservationDetail;
}

const STATUS_LABEL: Record<ReservationDisplayStatus, string> = {
  UPCOMING: '시술 예정',
  COMPLETED: '시술 완료',
  CANCELLED: '시술 취소',
};

export default function ReservationDetailCard({
  reservation,
}: ReservationDetailCardProps) {
  const status = getReservationDisplayStatus({
    reservationStatus: reservation.reservationStatus,
    reservationDate: reservation.reservationDate,
  });
  const backgroundColor =
    status === 'UPCOMING' ? 'bg-[#FFF3F8]' : 'bg-[#F7F8F9]';

  const totalPrice =
    typeof reservation.totalPrice === 'number' ? reservation.totalPrice : 0;

  const paymentAmount =
    typeof reservation.paymentAmount === 'number'
      ? reservation.paymentAmount
      : 0;

  const rows = [
    {
      label: '예약 상태',
      value: STATUS_LABEL[status],
    },
    {
      label: '샵명',
      value: reservation.shopName || '-',
    },
    {
      label: '아트',
      value: reservation.artName || '-',
    },
    {
      label: '일시',
      value: formatReservationDateLabel(
        reservation.reservationDate,
        reservation.reservationStartTime,
      ),
    },
    {
      label: '총 금액',
      value: `${totalPrice.toLocaleString()} 원`,
    },
  ];

  return (
    <section>
      <div className={`rounded-[10px] px-[12px] py-[4px] ${backgroundColor}`}>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex min-h-[38px] items-center justify-between border-b border-[#E9EBEE] mb-[3px]"
          >
            <span className="shrink-0 text-[11px] font-medium text-[#ADB0B5]">
              {row.label}
            </span>

            <span className="text-right text-[11px] font-medium text-[#171B1C]">
              {row.value}
            </span>
          </div>
        ))}

        <div className="flex min-h-[40px] items-center justify-between">
          <span className="shrink-0 text-[11px] font-medium text-[#ADB0B5]">
            결제 금액
          </span>

          <span className="text-right text-[13px] font-semibold text-[#F70071]">
            {paymentAmount.toLocaleString()} 원
          </span>
        </div>
      </div>
    </section>
  );
}
