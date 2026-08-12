// [I101] 예약 확인 및 결제 동의 팝업 (취소/환불 규정 상세)

interface PaymentConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REFUND_POLICY_TEXT = `예약금은 예약 확정을 위한 금액으로, 예약일 기준 1일 전까지 취소 시 전액 환불됩니다.
예약 당일 취소 또는 노쇼(No-show) 시에는 예약금이 환불되지 않습니다.
샵 사정으로 인한 취소의 경우, 예약금 전액이 환불됩니다.`;

export default function PaymentConsentModal({
  isOpen,
  onClose,
}: PaymentConsentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-[85%] w-full max-h-[70vh] overflow-y-auto mx-6">
        <h2 className="text-lg font-bold mb-3 text-[#171B1C]">
          취소·환불 규정
        </h2>
        <p className="text-sm text-[#646F7C] whitespace-pre-line leading-relaxed">
          {REFUND_POLICY_TEXT}
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#171B1C] text-white py-2 rounded-lg cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
