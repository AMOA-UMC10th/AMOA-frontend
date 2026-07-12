// G101 홈 상단 헤더 (로고 + 알림)

import logo from '../../assets/AMOA3.png';

export default function HomeHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <img src={logo} alt="AMOA" className="h-17" />
      <button aria-label="알림">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="#28323C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 01-3.46 0"
            stroke="#28323C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
