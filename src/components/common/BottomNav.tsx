// 공통 하단 네비게이션 바

import { useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  icon: () => React.ReactNode;
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9.5z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M21 21l-4.35-4.35"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.35-9.5-8.5C1 9 2.5 5.5 6 5c2-.3 3.5.7 6 3 2.5-2.3 4-3.3 6-3 3.5.5 5 4 3.5 7.5C19 16.65 12 21 12 21z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M4 20c0-4 3.5-6 8-6s8 2 8 6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', path: '/home', icon: HomeIcon },
  { label: '아트찾기', path: '/art-search', icon: SearchIcon },
  { label: '찜', path: '/wishlist', icon: HeartIcon },
  { label: '마이페이지', path: '/my', icon: UserIcon },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto h-20 bg-[#000000] flex items-center px-6">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex-1 flex flex-col items-center gap-1"
        >
          {item.icon()}
          <span className="text-[11px] text-white">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
