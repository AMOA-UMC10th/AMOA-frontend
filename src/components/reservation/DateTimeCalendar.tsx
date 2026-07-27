// [I101] 날짜/시간 선택 캘린더 (예약 가능 시간대 활성화)

import { useMemo, useState } from 'react';
import {
  ChevronLeftSmallIcon,
  ChevronRightSmallIcon,
} from '../../assets/icons';
import { getTimeSlotsForDate, getTodayKey } from '../../data/mockupdata/reservationData';

interface DateTimeCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
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
}: DateTimeCalendarProps) {
  const today = useMemo(() => new Date(), []);

  // 오늘 날짜의 시간을 00:00:00으로 맞춤
  const todayStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today],
  );

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // 현재 보고 있는 달의 1일이 무슨 요일인지 확인
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  // 현재 보고 있는 달의 총 일수
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days = useMemo(() => {
    const arr: Array<number | null> = [];

    // 1일 이전의 빈칸 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push(null);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      arr.push(day);
    }

    return arr;
  }, [firstDayOfMonth, daysInMonth]);

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

  const timeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  return (
    <div className="px-5 pt-6">
      {/* 연도 및 월 이동 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="cursor-pointer p-2 text-[#646F7C]"
          aria-label="이전 달"
        >
          <ChevronLeftSmallIcon className="h-3 w-2" />
        </button>

        <span className="text-lg font-bold text-[#171B1C]">
          {viewYear}년 {viewMonth + 1}월
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="cursor-pointer p-2 text-[#646F7C]"
          aria-label="다음 달"
        >
          <ChevronRightSmallIcon className="h-3 w-2" />
        </button>
      </div>

      {/* 요일 */}
      <div className="mt-8.5 grid grid-cols-7 text-center text-sm text-[#646F7C]">
        {WEEKDAYS.map((weekday, index) => (
          <span key={weekday} className={index === 0 ? 'text-[#F70071]' : ''}>
            {weekday}
          </span>
        ))}
      </div>

      {/* 날짜 */}
      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {days.map((day, index) => {
          if (day === null) {
            return <span key={`blank-${index}`} />;
          }

          const dateKey = toDateKey(viewYear, viewMonth, day);
          const currentDate = new Date(viewYear, viewMonth, day);
          const isSelected = selectedDate === dateKey;
          const isToday = getTodayKey() === dateKey;
          const isPast = currentDate < todayStart;

          return (
            <div key={dateKey} className="flex flex-col items-center gap-0.2">
              <button
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateKey)}
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-md ${
                  isPast
                    ? 'cursor-not-allowed text-[#E9EBEE]'
                    : 'cursor-pointer'
                } ${
                  isSelected
                    ? 'bg-[#F70071] font-medium text-white'
                    : isPast
                      ? ''
                      : 'text-[#171B1C]'
                }`}
              >
                {day}
              </button>

              <span
                className={`text-[11px] text-[#ADB0B5] ${isToday ? '' : 'invisible'}`}
              >
                오늘
              </span>
            </div>
          );
        })}
      </div>

      {/* 예약 시간 */}
      {selectedDate && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => onSelectTime(slot.time)}
                className={`cursor-pointer rounded-lg border border-[1.5px] py-3.5 text-sm disabled:cursor-not-allowed disabled:border-[#D4D7DC] disabled:bg-[#F7F8FA] disabled:text-[#ADB0B5] ${
                  isSelected
                    ? 'border-[#F70071] bg-[#F70071] font-medium text-white'
                    : 'border-[#D4D7DC] text-[#171B1C]'
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
