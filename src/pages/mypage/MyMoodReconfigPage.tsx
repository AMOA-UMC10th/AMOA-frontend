// [F104] 선호 디자인 재설정 화면
//
// 온보딩(A102)과는 별개의 독립 화면이다. 마이페이지에서 진입하고, 뒤로가기는 마이페이지로 나간다.
// 온보딩이 "처음 고르는" 화면이라면 이 화면은 "이미 고른 걸 고치는" 화면이라,
// 진입 시점부터 기존 선택값이 켜져 있고 하단 CTA도 [다음]이 아니라 [저장]이다.
//
// 설계서 0번 항목:
// - 진입 시 사용자가 이전에 선택했던 디자인 항목이 미리 체크된 상태로 표시됨
// - 기존 선택값을 확인한 뒤, 변경하고 싶은 항목만 선택/해제하여 수정
// - 저장 시 즉시 반영되며, 홈 화면 맞춤 추천(G101)에 반영

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import { getMoodImage } from '../../assets/moods';
import MoodCard from '../../components/onboarding/MoodCard';
import { getDesignMoods, type DesignMood } from '../../data/designMood';
import { getMyProfile, updateMyProfile, type UserProfile } from '../../api/user';

export default function MyMoodReconfigPage() {
  const navigate = useNavigate();

  const [moods, setMoods] = useState<DesignMood[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 무드 목록과 내 프로필을 함께 받아야 "이전 선택값이 체크된 상태"를 만들 수 있다.
  useEffect(() => {
    let cancelled = false;

    Promise.all([getDesignMoods(), getMyProfile()])
      .then(([moodList, myProfile]) => {
        if (cancelled) return;
        setMoods(moodList);
        setProfile(myProfile);
        setSelected(myProfile.selectedDesignTagIds);
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
    setSelected((prev) =>
      prev.includes(designtagId)
        ? prev.filter((id) => id !== designtagId)
        : [...prev, designtagId],
    );
  }

  function handleBack() {
    navigate('/mypage');
  }

  const canSave = selected.length > 0 && !isSaving;

  // PATCH는 디자인태그와 관심지역을 둘 다 필수로 받고, 빈 배열을 보내면 전체 삭제된다.
  // 이 화면에서 건드리지 않는 관심지역은 조회해온 값을 그대로 다시 보내 유지시킨다.
  async function handleSave() {
    if (!canSave || !profile) return;

    setIsSaving(true);
    try {
      await updateMyProfile({
        selectedDesignTagIds: selected,
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
          onClick={handleBack}
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
          <p className="py-16 text-center text-sm text-[#ADB0B5]">불러오는 중...</p>
        )}

        {!isLoading && loadError && (
          <p className="py-16 text-center text-sm text-[#ADB0B5]">{loadError}</p>
        )}

        {!isLoading && !loadError && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {moods.map((mood) => (
              <MoodCard
                key={mood.designtagId}
                label={mood.name}
                imageUrl={getMoodImage(mood.name)}
                selected={selected.includes(mood.designtagId)}
                onClick={() => toggleMood(mood.designtagId)}
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
