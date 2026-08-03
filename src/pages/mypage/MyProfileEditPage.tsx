// [F101, F104] 내 정보 관리 화면 (프로필 수정 및 관심 지역/무드 재설정 통합 진입점)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import ProfileForm from '../../components/mypage/ProfileEdit';
import {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  type UserProfile,
} from '../../data/userdata/user';


export default function MyProfileEditPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    getMyProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error(err);
        setLoadError('내 정보를 불러오지 못했어요.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // PATCH는 디자인태그와 관심지역을 필수로 요구한다.
  // 지금 화면에서 바꾸지 않는 값은 조회해온 값을 그대로 다시 보내 유지시킨다.
  function keepSelections(current: UserProfile) {
    return {
      selectedDesignTagIds: current.selectedDesignTagIds,
      interestedRegionIds: current.interestedRegions.map((r) => r.regionId),
    };
  }

  // 항목별 [변경하기]가 곧 저장이다. 성공했을 때만 true를 돌려줘서
  // 폼이 입력 상태를 닫도록 한다.
  async function saveField(
    patch: { nickname?: string; phoneNumber?: string; profileImageUrl?: string },
    successMessage: string,
  ): Promise<boolean> {
    if (!profile) return false;

    try {
      const updated = await updateMyProfile({
        ...keepSelections(profile),
        ...patch,
      });
      setProfile(updated);
      setToast(successMessage);
      return true;
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error ? err.message : '저장에 실패했어요');
      return false;
    }
  }

  const handleSaveNickname = (nickname: string) =>
    saveField({ nickname }, '닉네임이 수정되었어요');

  const handleSavePhone = (phoneNumber: string) =>
    saveField({ phoneNumber }, '전화번호가 수정되었어요');

  // 사진만 전용 업로드 API를 쓴다. 통합 수정을 거치지 않으므로
  // 디자인태그·관심지역을 다시 실어보낼 필요가 없다.
  async function handleSaveImage(file: File): Promise<string | null> {
    if (!profile) return null;

    try {
      const { profileImageUrl } = await updateProfileImage(file);
      setProfile({ ...profile, profileImageUrl });
      setToast('프로필 사진이 변경되었어요');
      return profileImageUrl;
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error ? err.message : '사진 변경에 실패했어요');
      return null;
    }
  }


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
        <h1 className="text-sm font-semibold text-[#171B1C]">정보 수정</h1>
      </header>

      {isLoading && (
        <p className="px-5 py-10 text-center text-sm text-[#ADB0B5]">
          불러오는 중...
        </p>
      )}

      {!isLoading && loadError && (
        <p className="px-5 py-10 text-center text-sm text-[#ADB0B5]">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && profile && (
        <div className="flex flex-col gap-10 px-5 py-8">
          <ProfileForm
            profileImageUrl={profile.profileImageUrl}
            name={profile.name}
            nickname={profile.nickname}
            email={profile.email}
            phoneNumber={profile.phoneNumber}
            onSaveNickname={handleSaveNickname}
            onSavePhone={handleSavePhone}
            onSaveImage={handleSaveImage}
          />
        </div>
      )}

      {/* 하단 탭 네비게이션에 가리지 않도록 그 위에 띄운다. */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F70071] px-5 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}