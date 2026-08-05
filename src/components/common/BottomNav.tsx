import { useLocation, useNavigate } from 'react-router-dom';

import {
  HomeIcon,
  NavSearchIcon,
  HeartIcon,
  UserIcon,
} from '../../assets/icons';

import { useRequireLogin } from '../../hooks/useRequireLogin';

interface NavItem {
  label: string;
  path: string;
  requiresLogin: boolean;
  icon: (props: { className?: string }) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '홈',
    path: '/home',
    requiresLogin: false,
    icon: HomeIcon,
  },
  {
    label: '아트찾기',
    path: '/art-search',
    requiresLogin: true,
    icon: NavSearchIcon,
  },
  {
    label: '찜',
    path: '/wishlist',
    requiresLogin: true,
    icon: HeartIcon,
  },
  {
    label: '마이페이지',
    path: '/mypage',
    requiresLogin: true,
    icon: UserIcon,
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requireLogin } = useRequireLogin();

  const hideBottomNav = location.pathname.startsWith('/mypage/reservations');

  const handleNavClick = (item: NavItem) => {
    if (item.requiresLogin && !requireLogin()) {
      return;
    }

    navigate(item.path);
  };

  if (hideBottomNav) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 h-16 bg-white border-t border-[#E9EBEE] flex items-center px-6">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.path}
          type="button"
          onClick={() => handleNavClick(item)}
          className="flex-1 flex flex-col items-center gap-1 text-[#000000]"
        >
          {item.icon({
            className: 'w-[22px] h-[22px]',
          })}

          <span className="text-[11px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
