import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  NavSearchIcon,
  HeartIcon,
  UserIcon,
} from '../../assets/icons';

interface NavItem {
  label: string;
  path: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', path: '/home', icon: HomeIcon },
  { label: '아트찾기', path: '/art-search', icon: NavSearchIcon },
  { label: '찜', path: '/wishlist', icon: HeartIcon },
  { label: '마이페이지', path: '/mypage', icon: UserIcon },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // BottomNav를 숨길 페이지
  const hideBottomNav = location.pathname.startsWith('/mypage/reservations');

  if (hideBottomNav) {
    return null;
  }
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 h-16 bg-white border-t border-[#E9EBEE] flex items-center px-6">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex-1 flex flex-col items-center gap-1 text-[#000000]"
        >
          {item.icon({ className: 'w-[22px] h-[22px]' })}
          <span className="text-[11px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
