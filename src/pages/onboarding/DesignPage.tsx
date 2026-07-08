//선호 디자인 선택 페이지 A102
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodCard from "../../components/onboarding/MoodCard";
import { ChevronLeftIcon } from "../../components/onboarding/icons";

const MOODS = ["심플", "아기자기", "화려", "스트릿", "유니크", "내추럴", "모던"];

export default function DesignPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleMood(mood: string) {
    setSelected((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  }

  const canProceed = selected.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="absolute left-4 text-gray-700"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-gray-900">서비스 시작하기</h1>
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
              selected={selected.includes(mood)}
              onClick={() => toggleMood(mood)}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => navigate("/onboarding/region")}
          className="mb-3 w-full text-center text-sm text-gray-400"
        >
          건너뛰기
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => {
            // TODO: 백엔드에 선호 디자인 선택 정보 저장 요청
            navigate("/onboarding/region");
          }}
          className={`w-full rounded-2xl py-4 text-sm font-semibold ${
            canProceed ? "bg-black text-white" : "bg-gray-100 text-gray-300"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
