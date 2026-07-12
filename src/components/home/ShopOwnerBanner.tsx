// 홈 하단 사장님 입점 유도 배너 (J101 입점 신청 연결용, 형태만 구현)

import { useNavigate } from 'react-router-dom';

export default function ShopOwnerBanner() {
  const navigate = useNavigate();

  const handleClick = () => {
    // TODO: J101(입점 신청) 페이지 담당자가 만들면 실제 라우트로 연결
    navigate('/apply');
  };

  return (
    <div className="pl-4 pr-8 mt-8 mb-4">
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-between bg-[#000000] text-white rounded-2xl px-4 py-3"
      >
        <div className="text-left">
          <p className="text-sm font-bold whitespace-nowrap">
            네일샵 사장님이신가요?
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 whitespace-nowrap">
            AMOA에 내 샵을 등록해보세요
          </p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
