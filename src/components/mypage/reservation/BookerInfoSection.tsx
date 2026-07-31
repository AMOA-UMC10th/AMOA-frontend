import type { ReservationDetail } from '../../../data/reservationAPI';

interface BookerInfoSectionProps {
  reservation: ReservationDetail;
}

export default function BookerInfoSection({
  reservation,
}: BookerInfoSectionProps) {
  const phoneNumber = reservation.customerPhoneNumber || '-';

  const requestMessage =
    reservation.requestMessage?.trim() || '요청사항이 없습니다.';

  return (
    <section className="mt-8">
      <h2 className="text-base font-bold text-[#171B1C]">예약자 정보</h2>

      <div className="mt-4 rounded-2xl border border-[#E9EBEE] bg-white px-4 py-5">
        <div className="flex items-start justify-between gap-5">
          <span className="shrink-0 text-sm text-[#ADB0B5]">예약자</span>

          <span className="text-right text-sm font-medium text-[#171B1C]">
            {reservation.customerName || '-'}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-5">
          <span className="shrink-0 text-sm text-[#ADB0B5]">연락처</span>

          <span className="text-right text-sm font-medium text-[#171B1C]">
            {phoneNumber}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-5">
          <span className="shrink-0 text-sm text-[#ADB0B5]">요청사항</span>

          <span className="max-w-[220px] whitespace-pre-wrap text-right text-sm font-medium leading-5 text-[#171B1C]">
            {requestMessage}
          </span>
        </div>
      </div>
    </section>
  );
}
