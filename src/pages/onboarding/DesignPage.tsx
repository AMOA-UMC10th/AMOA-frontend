import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MoodCard from "../../components/onboarding/MoodCard";
import { getMoodImage } from "../../assets/moods";
import { getDesignMoods, type DesignMood } from "../../data/designMood";

interface DesignTag {
  designtagId: number;
  name: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

async function fetchDesignMoods(): Promise<DesignMood[]> {
  const token = localStorage.getItem("tempToken");
  const res = fetch(`${import.meta.env.VITE_API_BASE_URL}/design-tags`, {
    headers: token
      ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
      : {},
  });
  
  const data: ApiResponse<{ designtags: DesignMood[] }> = await (await res).json();
  if (!data.isSuccess) {
    throw new Error(data.message);
  }
  return data.result.designtags;
}

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

  function handleBack() {
    navigate("/home", { replace: true });
  }

  function goNext(designTagIds: number[]) {
    navigate("/onboarding/region", {
      state: { ...location.state, designTagIds },
    });
  }

  const canProceed = selected.length > 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white">
      <header className="relative flex h-[50px] shrink-0 items-center justify-center border-b border-[#E9EBEE] px-5">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-3.5 flex h-10 w-10 items-center justify-start"
          aria-label="뒤로가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#171B1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className="text-[13px] font-semibold text-[#000000]">
          서비스 시작하기
        </h2>
      </header>

      <main className="flex flex-1 flex-col px-[24px] pb-[29px] pt-[42px]">
        <section>
          <h1 className="text-[21px] font-semibold leading-[1.5] text-[#000000]">
            어떤 느낌의 디자인을
            <br />
            선호하시나요?
          </h1>

          <p className="mt-[7px] text-[13px] font-medium leading-[1.5] text-[#646F7C]">
            여러 개 선택할 수 있어요
          </p>

          <div className="mt-[42px] grid grid-cols-2 gap-x-5 gap-y-5">
            {moods.map((mood) => (
              <MoodCard
                key={mood.designTagId}
                label={mood.name}
                imageUrl={getMoodImage(mood.name)}
                selected={selected.includes(mood.designTagId)}
                onClick={() => toggleMood(mood.designTagId)}
              />
            ))}
          </div>
        </section>

        <div className="flex-1 min-h-[30px]" />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => goNext([])}
            className="text-[13px] text-[#ADB0B5]"
          >
            건너뛰기
          </button>
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => goNext(selected)}
            className={`h-[52px] w-full rounded-[10px] text-[15px]
              font-medium text-white transition-colors
              ${canProceed ? 'bg-[#F70071]' : 'cursor-not-allowed bg-[#FFC0DC]'}
            `}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}