import {
  formatReservationDateLabel,
  type ReservationDetail,
} from '../../../data/reservationAPI';

interface ReservationDetailCardProps {
  reservation: ReservationDetail;
}

export default function ReservationDetailCard({
  reservation,
}: ReservationDetailCardProps) {
  const totalPrice =
    typeof reservation.totalPrice === 'number' ? reservation.totalPrice : 0;

  const paymentAmount =
    typeof reservation.paymentAmount === 'number'
      ? reservation.paymentAmount
      : 0;

  const rows = [
    {
      label: '샵',
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
      value: `${totalPrice.toLocaleString()}원`,
    },
    {
      label: '결제 금액',
      value: `${paymentAmount.toLocaleString()}원`,
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E9EBEE] bg-white px-4 py-5">
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-5"
          >
            <span className="shrink-0 text-sm text-[#ADB0B5]">{row.label}</span>

            <span className="text-right text-sm font-medium text-[#171B1C]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
