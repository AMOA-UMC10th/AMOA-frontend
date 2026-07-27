// [F103] 예약자 상세 정보 영역
// 이름, 연락처, 요청사항 표시

import type { SavedReservation } from '../../../data/mockupdata/reservationData';

interface BookerInfoSectionProps {
  reservation: SavedReservation;
}

export default function BookerInfoSection({
  reservation,
}: BookerInfoSectionProps) {
  return (
    <section className="mt-7">
      <h2 className="text-base font-bold text-[#171B1C]">예약자 정보</h2>

      <div className="mt-6 flex flex-col gap-5 px-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="shrink-0 text-[#ADB0B5]">이름</span>

          <span className="ml-5 text-right text-[#171B1C]">
            {reservation.customerName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="shrink-0 text-[#ADB0B5]">연락처</span>

          <span className="ml-5 text-right text-[#171B1C]">
            {reservation.customerPhone}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <span className="shrink-0 text-[#ADB0B5]">요청사항</span>

          <span className="ml-5 max-w-[70%] break-words text-right leading-5 text-[#171B1C]">
            {reservation.requestNote || '-'}
          </span>
        </div>
      </div>
    </section>
  );
}
