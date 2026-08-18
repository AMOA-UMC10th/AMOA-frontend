// 찜 결과를 알리는 토스트.
//
// 토스트는 화면 아래 정중앙에 떠야 하는데, position: fixed는 조상에 transform이
// 하나라도 걸려 있으면 화면이 아니라 "그 조상"을 기준으로 잡는다.
// (찜 목록 샵 카드의 translate-y-0.5, 아트 상세 하단 바의 -translate-x-1/2 등)
// 그러면 토스트가 카드 안쪽에 박혀버려서, body로 빼내 어떤 조상에도
// 영향받지 않게 한다.

import { createPortal } from 'react-dom';

interface LikeToastProps {
  // true면 저장, false면 삭제 문구를 띄운다.
  saved: boolean;
  fadingOut: boolean;
}

export default function LikeToast({ saved, fadingOut }: LikeToastProps) {
  return createPortal(
    <div
      className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-sm text-white shadow-lg transition-opacity duration-500 ease-out ${
        saved ? 'bg-[#F70071]' : 'bg-[#171B1C]'
      } ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {saved ? '찜 목록에 저장되었어요' : '찜 목록에서 삭제되었어요'}
    </div>,
    document.body,
  );
}
