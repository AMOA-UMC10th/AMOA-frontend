import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../assets/icons';
import { withdrawUser } from '../../data/withdraw';

export default function WithdrawPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await withdrawUser();
      navigate('/home');
    } catch (err) {
      console.error(err);
      setErrorMessage('회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center h-11 px-4 border-b border-[#E9EBEE]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 cursor-pointer"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#646F7C]" />
        </button>
        <span className="text-[13px] font-semibold text-black">회원탈퇴</span>
      </div>
      <div className="flex flex-col items-start gap-[15px] px-[15px] pt-6">
        <div>
          <p className="text-base font-bold text-[#171B1C]">탈퇴하시겠어요?</p>
          <p className="text-xs font-medium text-[#646F7C] mt-1">
            탈퇴하면 찜 목록과 설정이 사라져요
          </p>
          {errorMessage && (
            <p className="text-xs font-medium text-[#F70071] mt-3">{errorMessage}</p>
          )}
        </div>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="w-[160px] h-[42px] rounded-xl border border-[#E9EBEE] text-sm font-semibold text-[#171B1C]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isSubmitting}
            className="w-[160px] h-[42px] rounded-xl bg-[#F70071] text-sm font-semibold text-white disabled:opacity-50"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
