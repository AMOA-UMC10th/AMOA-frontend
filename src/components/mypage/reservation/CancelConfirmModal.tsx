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
      contentClassName="w-[320px] rounded-2xl bg-white px-6 pt-8 pb-6"
    >
      <div className="flex h-full w-full flex-col gap-[14px]">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-center text-base font-medium leading-6 text-[#171B1C]">
            예약을 취소하시겠어요?
          </h2>
          <p className="text-center text-xs leading-5 text-[#ADB0B5]">
            환불 정책에 따라 예약금이
            <br />
            반환되지 않을 수 있어요
          </p>
        </div>

        <div className="mt-1 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 flex-1 rounded-xl bg-[#F5F5F5] text-sm font-medium text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
          >
            돌아가기
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-12 flex-1 rounded-xl bg-[#F70071] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '취소 중...' : '취소하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
