//선호 디자인 선택 페이지 A102
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MoodCard from "../../components/onboarding/MoodCard";
import { ChevronLeftIcon } from "../../assets/icons";
import { getDesignMoods, type DesignTag } from "../../data/userProfile";

const MAX_DESIGN_TAGS = 3;

export default function DesignPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [moods, setMoods] = useState<DesignTag[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getDesignMoods()
      .then(setMoods)
      .catch((err) => {
        console.error(err);
        setMoods([]);
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  function toggleMood(id: number) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((m) => m !== id);
      if (prev.length >= MAX_DESIGN_TAGS) {
        setToast(`최대 ${MAX_DESIGN_TAGS}개까지 선택할 수 있어요`);
        return prev;
      }
      return [...prev, id];
    });
  }

  const canProceed = selected.length > 0;

  function goNext(designTagIds: number[]) {
    navigate("/onboarding/region", { state: { ...location.state, designTagIds } });
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate("/login")}
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
          {moods.map((mood) => (
            <MoodCard
              key={mood.designtagId}
              label={mood.name}
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

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#F70071] px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
