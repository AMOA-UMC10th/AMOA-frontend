//선호 디자인 선택 페이지 A102
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MoodCard from "../../components/onboarding/MoodCard";
import { ChevronLeftIcon } from "../../assets/icons";
import { getMoodImage } from "../../assets/moods";
import { getDesignMoods, type DesignMood } from "../../data/designMood";

export default function DesignPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [moods, setMoods] = useState<DesignMood[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    getDesignMoods()
      .then(setMoods)
      .catch((err) => console.error(err));
  }, []);

  function toggleMood(designtagId: number) {
    setSelected((prev) =>
      prev.includes(designtagId)
        ? prev.filter((id) => id !== designtagId)
        : [...prev, designtagId]
    );
  }

  // 뒤로가기는 히스토리(-1) 대신 경로를 고정한다. 새로고침이나 주소 직접 진입처럼
  // 돌아갈 기록이 없을 때 앱 밖으로 나가버리는 걸 막는다.
  function handleBack() {
    navigate("/home", { replace: true });
  }

  // 선택한 디자인태그 ID를 다음 단계(지역 → 닉네임 → 전화번호)까지 state로 들고 간다.
  function goNext(designTagIds: number[]) {
    navigate("/onboarding/region", {
      state: { ...location.state, designTagIds },
    });
  }

  const canProceed = selected.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={handleBack}
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

        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
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
      </div>

      <div className="shrink-0 px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => goNext([])}
          className="mb-3 w-full text-center text-sm text-gray-400"
        >
          건너뛰기
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => goNext(selected)}
          className={`w-full rounded-2xl py-4 text-sm font-semibold text-white ${
            canProceed ? "bg-[#F70071]" : "bg-[#FFC0DC]"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}