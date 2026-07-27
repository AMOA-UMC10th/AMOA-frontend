// [F101] 내 정보 관리 - 정보수정 화면 (프로필 조회/수정 전용)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import ProfileForm, { type ProfileFormValue } from '../../components/mypage/ProfileForm';
import { getMyProfile, updateMyProfile } from '../../data/userProfile';

export default function MyProfileEditPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    profileImageUrl: '',
    name: '',
    nickname: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile({
          profileImageUrl: data.profileImageUrl,
          name: data.name,
          nickname: data.nickname,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      })
      .catch((err) => {
        console.error(err);
        setToast('프로필을 불러오지 못했어요');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleProfileSave = async (value: ProfileFormValue) => {
    try {
      await updateMyProfile({
        profileImageUrl: value.profileImageUrl,
        nickname: value.nickname,
        phoneNumber: value.phoneNumber.replace(/\D/g, ''),
      });
      setProfile((prev) => ({ ...prev, ...value }));
      setToast('프로필이 저장되었어요');
    } catch (err) {
      console.error(err);
      setToast('프로필 저장에 실패했어요');
    }
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

      {!loading && (
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
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
