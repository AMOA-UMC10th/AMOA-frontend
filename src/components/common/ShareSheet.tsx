// 공유하기 바텀시트 안 씀

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const APPS = [
  { label: '카카오톡', icon: '💬', color: '#FEE500' },
  { label: 'Instagram', icon: '📷', color: '#E4405F' },
  { label: '메모', icon: '📝', color: '#FFD84D' },
  { label: '미리 알림', icon: '📋', color: '#FFFFFF' },
];

const ACTIONS = ['복사', '북마크에 추가', '읽기 목록에 추가', '더보기'];

export default function ShareSheet({ isOpen, onClose, url }: ShareSheetProps) {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-t-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-4 border-b border-[#E9EBEE]">
          <span className="w-10 h-10 rounded-lg bg-[#171B1C] flex items-center justify-center text-white text-lg">
            ▲
          </span>
          <div>
            <p className="text-sm font-bold text-[#171B1C]">AMOA 네일</p>
            <p className="text-xs text-[#ADB0B5]">amoa-card.vercel.app</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-4">
          {APPS.map((app) => (
            <button
              key={app.label}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: app.color }}
              >
                {app.icon}
              </span>
              <span className="text-[11px] text-[#171B1C]">{app.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#E9EBEE]">
          {ACTIONS.map((action) => (
            <button
              key={action}
              onClick={action === '복사' ? handleCopy : onClose}
              className="flex flex-col items-center gap-1 py-2"
            >
              <span className="w-8 h-8 rounded-full bg-[#F4F4F4] flex items-center justify-center text-sm">
                •
              </span>
              <span className="text-[10px] text-[#171B1C] text-center">
                {action}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
