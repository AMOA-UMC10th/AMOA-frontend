// [F104] 내 정보 관리 - 선호 디자인(무드) 재설정 화면

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import MoodCard from '../../components/onboarding/MoodCard';
import { mockSettingData } from '../../data/mockupdata/userData';

const MOODS = ['심플', '아기자기', '화려', '스트릿', '유니크', '내추럴', '모던'];

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

export default function MyMoodReconfigPage() {
  const navigate = useNavigate();
  const setting = mockSettingData.result;

  const [selectedMoods, setSelectedMoods] = useState<string[]>(() =>
    setting.preferredMoods.map(toMoodLabel).filter((m) => MOODS.includes(m)),
  );

  function toggleMood(mood: string) {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  }

  const canSave = selectedMoods.length > 0;

  function handleSave() {
    if (!canSave) return;
    // TODO: 백엔드에 선호 디자인 무드 재설정 요청 (moods는 toMoodCode로 변환해 전송)
    void selectedMoods.map(toMoodCode);
    navigate('/mypage');
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          {MOODS.map((mood) => (
            <MoodCard
              key={mood}
              label={mood}
              selected={selectedMoods.includes(mood)}
              onClick={() => toggleMood(mood)}
            />
          ))}
        </div>
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
          저장
        </button>
      </div>
    </main>
  );
}
