//약관동의 A106

import { useNavigate } from 'react-router-dom';

export default function SignupCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-sm mx-auto p-6 flex flex-col min-h-screen items-center">
      <div className="flex-1" />

      <span className="w-16 h-16 rounded-full bg-[#F70071] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h1 className="text-2xl font-bold mb-4">가입완료!</h1>
      <p className="text-sm text-[#646F7C] font-bold text-center whitespace-pre-line">
        {'지금 바로 내 주변\n네일아트를 찾아보세요'}
      </p>

      <div className="flex-1" />

      <button
        onClick={() => navigate('/home')}
        className="w-full bg-[#F70071] text-white rounded-lg py-3"
      >
        시작하기
      </button>
    </div>
  );
}
