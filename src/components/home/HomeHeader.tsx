// G101 홈 상단 헤더 (로고 + 알림)

import logo from '../../assets/AMOA3.png';
import notificationIcon from '../../assets/notifications.png';

export default function HomeHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <img src={logo} alt="AMOA" className="h-10" />
      <button aria-label="알림" className="p-1 hover:opacity-70 transition-opacity">
        <img src={notificationIcon} alt="알림" className="w-6 h-6" />
      </button>
    </div>
  );
}