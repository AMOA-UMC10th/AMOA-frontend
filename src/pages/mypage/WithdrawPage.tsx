import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';

export default function WithdrawPage() {
  const navigate = useNavigate();

  const handleWithdraw = () => {
    // TODO: 실제 회원 탈퇴 처리 API 연동
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center px-4 py-4 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#171B1C]" />
        </button>
        <span className="text-base font-bold text-[#171B1C]">회원탈퇴</span>
      </div>
      <div className="px-4 pt-6">
        <p className="text-base font-bold text-[#171B1C]">탈퇴하시겠어요?</p>
        <p className="text-xs font-medium text-[#646F7C] mt-1">
          탈퇴하면 찜 목록과 설정이 사라져요
        </p>
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 h-12 rounded-xl border border-[#E9EBEE] text-sm font-semibold text-[#171B1C]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="flex-1 h-12 rounded-xl bg-[#F70071] text-sm font-semibold text-white"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
