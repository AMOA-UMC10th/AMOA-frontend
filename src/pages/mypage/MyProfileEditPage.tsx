// [F101] 내 정보 관리 - 정보수정 화면 (프로필 조회/수정 전용)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import ProfileForm, { type ProfileFormValue } from '../../components/mypage/ProfileForm';
import { mockSettingData } from '../../data/mockupdata/userData';

export default function MyProfileEditPage() {
  const navigate = useNavigate();
  const setting = mockSettingData.result;

  const [profile, setProfile] = useState({
    profileImageUrl: setting.profileImageUrl,
    name: setting.nickname,
    nickname: setting.nickname,
    email: setting.email,
    phoneNumber: setting.phoneNumber,
  });
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

  return (
    <main className="min-h-dvh bg-white pb-16">
      <header className="relative flex h-[72px] items-center justify-center border-b border-[#E9EBEE] px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">정보수정</h1>
      </header>

      <div className="px-5 py-8">
        <ProfileForm
          profileImageUrl={profile.profileImageUrl}
          name={profile.name}
          nickname={profile.nickname}
          email={profile.email}
          phoneNumber={profile.phoneNumber}
          onSave={handleProfileSave}
        />
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
