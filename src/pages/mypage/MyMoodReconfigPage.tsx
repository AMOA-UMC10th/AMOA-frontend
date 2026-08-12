// [F104] 내 정보 관리 - 선호 디자인(무드) 재설정 화면
//
// 온보딩 A102와 화면 구성이 같아서 components/onboarding의 MoodCard를 그대로 쓴다.
// 다른 점은 "이미 고른 값을 고치는" 화면이라는 것 하나다.
// - 진입 시 이전에 선택한 무드가 켜진 상태로 표시된다
// - 건너뛰기가 없고 하단 CTA가 [저장]이다

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import { getMoodImage } from '../../assets/moods';
import MoodCard from '../../components/onboarding/MoodCard';
import { getDesignMoods, type DesignMood } from '../../data/designMood';
import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from '../../data/userdata/user';

// 진입 시점과 지금 고른 값이 같은지 비교하려고 정렬해 문자열로 만든다. (순서는 무시)
function toIdKey(ids: number[]): string {
  return [...ids].sort((a, b) => a - b).join(',');
}

export default function MyMoodReconfigPage() {
  const navigate = useNavigate();

  const [moods, setMoods] = useState<DesignMood[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // 바뀐 게 없으면 [저장]을 비활성으로 두기 위해 진입 시점의 값을 들고 있는다.
  const [initialKey, setInitialKey] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 무드 목록과 내 프로필을 함께 받아야 "이전에 고른 무드가 켜진 상태"를 만들 수 있다.
  useEffect(() => {
    let cancelled = false;

    Promise.all([getDesignMoods(), getMyProfile()])
      .then(([moodList, myProfile]) => {
        if (cancelled) return;
        setMoods(moodList);
        setProfile(myProfile);
        setSelectedIds(myProfile.selectedDesignTagIds);
        setInitialKey(toIdKey(myProfile.selectedDesignTagIds));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error(err);
        setLoadError('선호 디자인 정보를 불러오지 못했어요.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleMood(designtagId: number) {
    setSelectedIds((prev) =>
      prev.includes(designtagId)
        ? prev.filter((id) => id !== designtagId)
        : [...prev, designtagId],
    );
  }

  // 바꾼 게 있어야 저장할 수 있다. (관심 지역 재설정과 동일한 규칙)
  const isDirty = toIdKey(selectedIds) !== initialKey;
  const canSave =
    isDirty && selectedIds.length > 0 && !isSaving && !isLoading && !loadError;

  // PATCH는 디자인태그와 관심지역을 둘 다 필수로 받고, 빈 배열을 보내면 전체 삭제된다.
  // 이 화면에서 건드리지 않는 관심지역은 조회해온 값을 그대로 되돌려보내 유지시킨다.
  async function handleSave() {
    if (!canSave || !profile) return;

    setIsSaving(true);
    try {
      await updateMyProfile({
        selectedDesignTagIds: selectedIds,
        interestedRegionIds: profile.interestedRegions.map((r) => r.regionId),
      });
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      setToast(err instanceof Error ? err.message : '저장에 실패했어요');
      setIsSaving(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100 px-4">
        <button
          type="button"
          onClick={() => navigate('/mypage')}
          className="absolute left-4 p-1 text-[#171B1C]"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-[#171B1C]">선호 디자인 재설정</h1>
      </header>

      <div className="flex-1 px-5 pt-6">
        <h2 className="text-xl font-bold leading-snug text-gray-900">
          어떤 느낌의 디자인을
          <br />
          선호하시나요?
        </h2>
        <p className="mt-2 text-sm text-gray-400">여러 개 선택할 수 있어요</p>

        {isLoading && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">불러오는 중...</p>
        )}

        {!isLoading && loadError && (
          <p className="py-20 text-center text-sm text-[#ADB0B5]">{loadError}</p>
        )}

        {!isLoading && !loadError && (
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
            {moods.map((mood) => (
              <MoodCard
                key={mood.designTagId}
                label={mood.name}
                imageUrl={getMoodImage(mood.name)}
                selected={selectedIds.includes(mood.designTagId)}
                onClick={() => toggleMood(mood.designTagId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            canSave ? 'bg-[#F70071]' : 'bg-[#FFC0DC]'
          }`}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
