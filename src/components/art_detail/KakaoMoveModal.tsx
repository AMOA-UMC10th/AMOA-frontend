//C102 카카오톡 예약 바로가기(이동확인 모달)

import Modal from '../common/Modal';

interface KakaoMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
}

export default function KakaoMoveModal({
  isOpen,
  onClose,
  shopName,
}: KakaoMoveModalProps) {
  const handleMove = () => {
    // TODO: 카카오톡 채널 연결 (설치 시 앱, 미설치 시 웹 폴백)
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="text-base font-bold text-center mb-2">
        카카오톡으로 이동할까요?
      </p>
      <p className="text-sm text-[#646F7C] text-center mb-6">
        {shopName} 채널로 연결돼요
      </p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-lg border border-[#E9EBEE] text-[#646F7C]"
        >
          취소
        </button>
        <button
          onClick={handleMove}
          className="flex-1 py-3 rounded-lg bg-[#171B1C] text-white"
        >
          이동하기
        </button>
      </div>
    </Modal>
  );
}
