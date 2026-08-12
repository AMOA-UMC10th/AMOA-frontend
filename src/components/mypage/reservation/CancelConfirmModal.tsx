import Modal from '../../common/Modal';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function CancelConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      contentClassName="w-[270px] rounded-[16px] bg-white px-[24px] pb-[24px] pt-[28px]"
    >
      <div className="flex w-full flex-col items-center">
        <h2 className="text-center text-[15px] font-semibold leading-[23px] text-[#171B1C]">
          예약을 취소하시겠어요?
        </h2>

        <p className="mt-[11px] text-center text-[11px] font-medium leading-[17px] text-[#ADB0B5]">
          환불 정책에 따라 예약금이
          <br />
          반환되지 않을 수 있어요
        </p>

        <div className="mt-[14px] flex h-[42px] w-full gap-[9px]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-[42px] flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-[#F2F2F2] text-[13px] font-semibold text-[#555555] disabled:cursor-not-allowed"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex h-[42px] flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-[#F70071] text-[13px] font-semibold text-white disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white"
                role="status"
                aria-label="예약 취소 중"
              />
            ) : (
              '취소하기'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
