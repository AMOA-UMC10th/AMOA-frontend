// [F103] 예약 상세 정보 카드
// 샵/아트/일시/총 금액/결제 금액 표시

import {
  formatReservationDateLabel,
  type SavedReservation,
} from '../../../data/reservationData';

interface ReservationDetailCardProps {
  reservation: SavedReservation;
}

export default function ReservationDetailCard({
  reservation,
}: ReservationDetailCardProps) {
  const rows = [
    {
      label: '샵',
      value: reservation.shopName,
    },
    {
      label: '아트',
      value: reservation.artLabel,
    },
    {
      label: '일시',
      value: formatReservationDateLabel(reservation.date, reservation.time),
    },
    {
      label: '총 금액',
      value: `${reservation.totalPrice.toLocaleString()}원`,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-[#FDFDFD] px-5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex min-h-[54px] items-center justify-between border-b border-[#EEE4E4] text-sm"
        >
          <span className="shrink-0 text-[#888888]">{row.label}</span>

          <span className="ml-4 text-right font-medium text-[#111111]">
            {row.value}
          </span>
        </div>
      ))}

      <div className="flex min-h-[54px] items-center justify-between text-sm">
        <span className="text-[#ADB0B5]">결제 금액</span>

        <span className="font-bold text-[#CD0000]">
          {reservation.depositPrice.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
