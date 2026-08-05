import { useLocation, useNavigate } from 'react-router-dom';

import {
  HomeIcon,
  NavSearchIcon,
  HeartIcon,
  UserIcon,
} from '../../assets/icons';

import { useRequireLogin } from '../../hooks/useReqireLogin';

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

  const isActivePath = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home';
    }

    return location.pathname.startsWith(path);
  };

  if (hideBottomNav) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 flex h-16 w-full max-w-[430px] -translate-x-1/2 items-center border-t border-[#E9EBEE] bg-white px-6">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(item.path);

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => handleNavClick(item)}
            className={`flex flex-1 flex-col items-center gap-1`}
          >
            {item.icon({
              className: 'h-[22px] w-[22px]',
            })}

            <span className="text-[11px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
