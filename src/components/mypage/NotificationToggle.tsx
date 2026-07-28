import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import {
  fetchMyProfile,
  updateNotificationSettings,
  type MyProfile,
} from '../../data/profile';

const RESERVATION_TYPE = 'RESERVATION';
const MARKETING_TYPE = 'MARKETING';

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
      className={`relative w-10 h-[22px] rounded-full shrink-0 transition-colors ${
        checked ? 'bg-[#F70071]' : 'bg-[#E9EBEE]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function NotificationToggle() {
  const navigate = useNavigate();
  const [reservationReminder, setReservationReminder] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // profileRef always holds the latest known profile so overlapping saves
  // never build their request body from a stale snapshot.
  const profileRef = useRef<MyProfile | null>(null);
  const saveQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    // StrictMode invokes this effect twice in dev; without this guard the
    // stale run's late response can overwrite state set by the other run
    // (or by a user interaction that happened in between).
    let cancelled = false;

    fetchMyProfile()
      .then((data) => {
        if (cancelled) return;
        profileRef.current = data;
        setReservationReminder(
          data.notificationSettings.find((s) => s.notificationType === RESERVATION_TYPE)
            ?.enabled ?? false,
        );
        setMarketingAgreed(
          data.notificationSettings.find((s) => s.notificationType === MARKETING_TYPE)
            ?.enabled ?? false,
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setLoadError('알림 설정을 불러오지 못했어요');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function queueNotificationSettingSave(
    notificationType: string,
    enabled: boolean,
    revert: () => void,
  ) {
    saveQueueRef.current = saveQueueRef.current.then(async () => {
      const profile = profileRef.current;
      if (!profile) return;

      const hasType = profile.notificationSettings.some(
        (s) => s.notificationType === notificationType,
      );
      const nextSettings = profile.notificationSettings.map((s) => ({
        notificationType: s.notificationType,
        enabled: s.notificationType === notificationType ? enabled : s.enabled,
      }));
      if (!hasType) {
        nextSettings.push({ notificationType, enabled });
      }

      try {
        const updated = await updateNotificationSettings(profile, nextSettings);
        profileRef.current = updated;
      } catch (err) {
        console.error(err);
        revert();
      }
    });
  }

  const handleToggleReservationReminder = () => {
    const next = !reservationReminder;
    setReservationReminder(next);
    queueNotificationSettingSave(RESERVATION_TYPE, next, () => setReservationReminder(!next));
  };

  const handleToggleMarketingAgreed = () => {
    const next = !marketingAgreed;
    setMarketingAgreed(next);
    queueNotificationSettingSave(MARKETING_TYPE, next, () => setMarketingAgreed(!next));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center h-11 px-4 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#646F7C]" />
        </button>
        <span className="text-[13px] font-semibold text-black">알림 설정</span>
      </div>
      {loadError && (
        <p className="px-4 pt-6 text-sm text-[#F70071]">{loadError}</p>
      )}
      <div>
        <div className="flex items-center justify-between py-3 px-6 border-b border-[#C5C8CE]">
          <div className="flex flex-col">
            <p className="text-[15px] font-medium text-[#171B1C]">예약 리마인드</p>
            <p className="text-[11px] font-medium text-[#646F7C]">
              예약 두 시간 전 알림을 보내드려요
            </p>
          </div>
          <ToggleSwitch
            checked={reservationReminder}
            onChange={handleToggleReservationReminder}
            label="예약 리마인드 토글"
          />
        </div>
        <div className="flex items-center justify-between py-3 px-6 border-b border-[#C5C8CE]">
          <div className="flex flex-col">
            <p className="text-[15px] font-medium text-[#171B1C]">마케팅 수신 동의</p>
            <p className="text-[11px] font-medium text-[#646F7C]">
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
    </div>
  );
}
