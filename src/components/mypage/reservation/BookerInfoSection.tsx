import {
  getReservationDisplayStatus,
  type ReservationDetail,
} from '../../../data/reservationAPI';

interface BookerInfoSectionProps {
  reservation: ReservationDetail;
}
function formatPhoneNumber(phoneNumber?: string) {
  if (!phoneNumber) return '-';

  const numbers = phoneNumber.replace(/\D/g, '');

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return phoneNumber;
}

export default function BookerInfoSection({
  reservation,
}: BookerInfoSectionProps) {
  const phoneNumber = formatPhoneNumber(reservation.customerPhoneNumber);

  const status = getReservationDisplayStatus({
    reservationStatus: reservation.reservationStatus,
    reservationDate: reservation.reservationDate,
  });

  const backgroundColor =
    status === 'UPCOMING' ? 'bg-[#FFF3F8]' : 'bg-[#F7F8F9]';

  const requestMessage = reservation.requestMessage?.trim() || '-';

  return (
    <section>
      <div className={`rounded-[10px] px-[12px] py-[4px] ${backgroundColor}`}>
        <div className="flex min-h-[38px] items-center justify-between border-b border-[#E9EBEE] mb-[3px]">
          <span className="text-[11px] text-[#ADB0B5]">이름</span>
          <span className="text-[11px] font-medium text-[#171B1C]">
            {reservation.customerName}
          </span>
        </div>

        <div className="flex min-h-[38px] items-center justify-between border-b border-[#E9EBEE] mb-[3px]">
          <span className="text-[11px] text-[#ADB0B5]">연락처</span>
          <span className="text-[11px] font-medium text-[#171B1C]">
            {phoneNumber}
          </span>
        </div>

        <div className="flex min-h-[38px] items-center justify-between">
          <span className="shrink-0 text-[11px] text-[#ADB0B5]">요청사항</span>
          <span className="text-right text-[11px] font-medium text-[#171B1C]">
            {requestMessage}
          </span>
        </div>
      </div>
    </section>
  );
}
