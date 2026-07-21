// [F101, F104] 내 정보 관리 화면 (프로필 수정 및 관심 지역/무드 재설정 통합 진입점)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import ProfileForm, { type ProfileFormValue } from '../../components/mypage/ProfileForm';
import OnboardingReconfig, {
  MOODS,
  type OnboardingReconfigValue,
} from '../../components/mypage/OnboardingReconfig';
import { mockSettingData } from '../../data/userData';

// 목업 응답의 지역 표기("서울특별시 강남구")를 온보딩 컴포넌트가 쓰는 구 단위 표기("강남구")로 변환
function toShortDistrict(fullLabel: string): string {
  return fullLabel.trim().split(' ').pop() ?? fullLabel;
}

// 백엔드 무드 코드 <-> 온보딩 화면 한글 라벨 매핑 (연동 전까지 목업 데이터에 한해 임시 사용)
const MOOD_CODE_TO_LABEL: Record<string, string> = {
  SIMPLE: '심플',
  UNIQUE: '유니크',
};
const MOOD_LABEL_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(MOOD_CODE_TO_LABEL).map(([code, label]) => [label, code]),
);

function toMoodLabel(code: string): string {
  return MOOD_CODE_TO_LABEL[code] ?? code;
}

function toMoodCode(label: string): string {
  return MOOD_LABEL_TO_CODE[label] ?? label;
}

export default function MyProfileEditPage() {
  const navigate = useNavigate();
  const setting = mockSettingData.result;

  const [profile, setProfile] = useState({
    profileImageUrl: setting.profileImageUrl,
    name: setting.name,
    nickname: setting.nickname,
    email: setting.email,
    phoneNumber: setting.phoneNumber,
  });
  const [regions, setRegions] = useState(setting.interestedRegions.map(toShortDistrict));
  const [moods, setMoods] = useState(setting.preferredMoods.map(toMoodLabel));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleProfileSave = (value: ProfileFormValue) => {
    // TODO: 백엔드에 프로필(닉네임/연락처/프로필사진) 수정 요청
    setProfile((prev) => ({ ...prev, ...value }));
    setToast('프로필이 저장되었어요');
  };

  const handleReconfigSave = (value: OnboardingReconfigValue) => {
    // TODO: 백엔드에 관심 지역/디자인 무드 재설정 요청 (moods는 toMoodCode로 변환해 전송)
    void value.moods.map(toMoodCode);
    setRegions(value.regions);
    setMoods(value.moods);
    setToast('관심 지역/무드가 저장되었어요');
  };

  return (
    <main className="min-h-dvh bg-white pb-16">
      <header className="relative flex h-[72px] items-center justify-center border-b border-[#eceef1] px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">내 정보 관리</h1>
      </header>

      <div className="flex flex-col gap-10 px-5 py-8">
        <ProfileForm
          profileImageUrl={profile.profileImageUrl}
          name={profile.name}
          nickname={profile.nickname}
          email={profile.email}
          phoneNumber={profile.phoneNumber}
          onSave={handleProfileSave}
        />

        <div className="border-t border-[#eceef1]" />

        <OnboardingReconfig
          initialRegions={regions}
          initialMoods={moods.filter((m) => MOODS.includes(m))}
          onSave={handleReconfigSave}
        />
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
