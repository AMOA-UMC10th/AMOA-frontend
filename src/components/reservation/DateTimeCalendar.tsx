// [I101] 날짜/시간 선택 캘린더 (예약 가능 시간대 활성화)

import { useMemo, useState } from 'react';
import {
  ChevronLeftSmallIcon,
  ChevronRightSmallIcon,
} from '../../assets/icons';
import { getTodayKey } from '../../data/mockupdata/reservationData';
import type { TimeSlot } from '../../data/mockupdata/reservationData';

interface DateTimeCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  timeSlots: TimeSlot[]; // 추가 — 부모(ReservationPage)가 실제 API로 받아와 내려줌
  isLoadingTimes?: boolean; // 추가
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
}

export default function DateTimeCalendar({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  timeSlots,
  isLoadingTimes = false,
}: DateTimeCalendarProps) {
  const today = useMemo(() => new Date(), []);

  const todayStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today],
  );

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days = useMemo(() => {
    const arr: Array<number | null> = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      arr.push(day);
    }
    return arr;
  }, [firstDayOfMonth, daysInMonth]);

  const viewMonthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const isSelectedDateInView =
    !!selectedDate && selectedDate.startsWith(viewMonthPrefix);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((year) => year - 1);
      setViewMonth(11);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((year) => year + 1);
      setViewMonth(0);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  return (
    <div className="px-[16px] pt-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="cursor-pointer h-[24px] w-[24px] px-[8px] py-[4px] text-[#ADB0B5]"
          aria-label="이전 달"
        >
          <ChevronLeftSmallIcon className="h-3 w-2" />
        </button>

        <span className="text-[15px] font-semibold text-[#171B1C]">
          {viewYear}년 {viewMonth + 1}월
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="cursor-pointer h-[24px] w-[24px] px-[8px] py-[4px] text-[#ADB0B5]"
          aria-label="다음 달"
        >
          <ChevronRightSmallIcon className="h-3 w-2" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 text-center text-[11px] text-[#646F7C]">
        {WEEKDAYS.map((weekday, index) => (
          <span key={weekday} className={index === 0 ? 'text-[#F70071]' : ''}>
            {weekday}
          </span>
        ))}
      </div>

      <div className="mt-[21.5px] grid grid-cols-7 gap-y-[13.5px] text-center">
        {days.map((day, index) => {
          if (day === null) {
            return <span key={`blank-${index}`} />;
          }

          const dateKey = toDateKey(viewYear, viewMonth, day);
          const currentDate = new Date(viewYear, viewMonth, day);
          const isSelected = selectedDate === dateKey;
          const isToday = getTodayKey() === dateKey;
          const isPast = currentDate < todayStart;
          const isSunday = currentDate.getDay() === 0;

          return (
            <div key={dateKey} className="flex flex-col items-center">
              <button
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateKey)}
                className={`mx-auto flex h-[28px] w-[28px] pt-[1px] items-center justify-center rounded-full text-[13px] ${
                  isPast
                    ? 'cursor-not-allowed text-[#D4D7DC]'
                    : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'bg-[#F70071] font-medium text-white'
                    : isPast
                      ? ''
                      : isSunday
                        ? 'text-[#F70071]'
                        : 'text-[#222222]'
                }`}
              >
                {day}
              </button>
              <span
                className={`text-[10px] text-[#C5C8CE] ${isToday ? '' : 'invisible'}`}
              >
                오늘
              </span>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6">
          {isLoadingTimes ? (
            <div className="flex justify-center py-40">
              <span
                className="h-6 w-6 animate-spin rounded-full border-2 border-[#E9EBEE] border-t-[#F70071]"
                role="status"
                aria-label="시간 불러오는 중"
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 grid-items-center gap-y-[10px] gap-x-[8px]">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelectTime(slot.time)}
                    className={`cursor-pointer rounded-[8px] border border-[1.5px] py-4 text-[11px] disabled:cursor-not-allowed disabled:border-[#C5C8CE] disabled:bg-[#F7F8F9] disabled:text-[#C5C8CE] ${
                      isSelected
                        ? 'border-[#F70071] bg-[#F70071] font-medium text-white'
                        : 'border-[#C5C8CE] text-[#1E2427]'
                    }`}
                  >
                    {slot.time.slice(0, 5)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
