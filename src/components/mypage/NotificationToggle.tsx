import { useState } from 'react';
import { mockSettingData } from '../../data/userData';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
        checked ? 'bg-[#F70071]' : 'bg-[#E9EBEE]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

interface NotificationToggleProps {
  initialReservationReminder?: boolean;
  initialMarketingAgreed?: boolean;
  onChangeReservationReminder?: (agreed: boolean) => void;
  onChangeMarketingAgreed?: (agreed: boolean) => void;
}

export default function NotificationToggle({
  initialReservationReminder = mockSettingData.result.reservationReminderAgreed,
  initialMarketingAgreed = mockSettingData.result.marketingAgreed,
  onChangeReservationReminder,
  onChangeMarketingAgreed,
}: NotificationToggleProps) {
  const [reservationReminder, setReservationReminder] = useState(
    initialReservationReminder,
  );
  const [marketingAgreed, setMarketingAgreed] = useState(
    initialMarketingAgreed,
  );

  const handleToggleReservationReminder = () => {
    const next = !reservationReminder;
    setReservationReminder(next);
    onChangeReservationReminder?.(next);
    // TODO: 알림 설정 저장 API 연동
  };

  const handleToggleMarketingAgreed = () => {
    const next = !marketingAgreed;
    setMarketingAgreed(next);
    onChangeMarketingAgreed?.(next);
    // TODO: 알림 설정 저장 API 연동
  };

  return (
    <div className="divide-y divide-[#E9EBEE]">
      <div className="flex items-center justify-between py-5 px-4">
        <div>
          <p className="text-base font-bold text-[#171B1C]">예약 리마인드</p>
          <p className="text-xs font-medium text-[#646F7C] mt-1">
            예약 두 시간 전 알림을 보내드려요
          </p>
        </div>
        <ToggleSwitch
          checked={reservationReminder}
          onChange={handleToggleReservationReminder}
          label="예약 리마인드 토글"
        />
      </div>
      <div className="flex items-center justify-between py-5 px-4">
        <div>
          <p className="text-base font-bold text-[#171B1C]">마케팅 수신 동의</p>
          <p className="text-xs font-medium text-[#646F7C] mt-1">
            새로운 이벤트 소식을 메일로 보내드려요
          </p>
        </div>
        <ToggleSwitch
          checked={marketingAgreed}
          onChange={handleToggleMarketingAgreed}
          label="마케팅 수신 동의 토글"
        />
      </div>
    </div>
  );
}
