import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, type UserProfile } from '../../data/userdata/user';
import defaultProfileImage from '../../assets/defaultProfile.png';

interface MenuItem {
  label: string;
  path?: string;
  action?: 'logout';
  danger?: boolean;
}

const MENU_GROUPS: MenuItem[][] = [
  [{ label: '예약 내역', path: '/mypage/reservations' }],
  [
    { label: '선호 디자인 재설정', path: '/mypage/designre' },
    { label: '관심 지역 재설정', path: '/mypage/regionre' },
  ],
  [
    { label: '알림설정', path: '/mypage/settings' },
    { label: '공지사항', path: '/mypage/notice' },
    { label: '이용약관', path: '/mypage/terms' },
    { label: '로그아웃', action: 'logout' },
    { label: '회원 탈퇴', path: '/mypage/withdraw', danger: true },
  ],
];

const LOGIN_PATH = '/login';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    getMyProfile()
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => {
        console.error('내 정보 조회 실패:', err);
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('로그아웃 API 호출 중 오류 발생:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tempToken');

      setIsLoggedIn(false);
      setUserProfile(null);
      setShowLogoutModal(false);
      alert('로그아웃되었습니다.');
      navigate('/mypage');
    }
  };

  const profileImageUrl =
    isLoggedIn && userProfile?.profileImageUrl
      ? userProfile.profileImageUrl
      : defaultProfileImage;

  const nickname = isLoggedIn
    ? userProfile?.nickname || '회원'
    : '로그인을 해주세요';

  const email = isLoggedIn
    ? userProfile?.email || ''
    : '로그인 후 이용 가능한 서비스입니다.';

  const handleAction = (item: MenuItem) => {
    if (!isLoggedIn) {
      navigate(LOGIN_PATH);
      return;
    }

    if (item.action === 'logout') {
      setShowLogoutModal(true);
      return;
    }

    if (item.path) {
      navigate(item.path);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="flex items-center justify-center h-14 border-b border-gray-100">
        <h1 className="text-lg font-bold">마이페이지</h1>
      </header>

      <section className="flex items-center justify-between px-[17px] py-[18px] border-b border-[#E9EBEE]">
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => !isLoggedIn && navigate(LOGIN_PATH)}
        >
          <img
            src={profileImageUrl}
            alt={`${nickname} 프로필 이미지`}
            className="w-[50px] h-[50px] rounded-full object-cover shrink-0 bg-gray-100"
          />
          <div>
            <p className="text-[15px] font-semibold text-[#171B1C]">{nickname}</p>
            <p className="text-[11px] font-medium text-[#ADB0B5]">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            isLoggedIn ? navigate('/mypage/edit') : navigate(LOGIN_PATH)
          }
          className="w-[65px] h-[25px] flex items-center justify-center rounded-full border border-[#171B1C] text-sm font-medium whitespace-nowrap"
        >
          {isLoggedIn ? '정보관리' : '로그인'}
        </button>
      </section>
      <div className="h-[11px] bg-gray-50" />

      {MENU_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx}>
          {group.map((item) => {
            if (!isLoggedIn && item.action === 'logout') return null;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleAction(item)}
                className="w-full flex items-center px-4 h-[50px] border-b border-[#E9EBEE] last:border-b-0 text-left active:bg-gray-100"
              >
                <span
                  className={`text-[15px] ${
                    item.danger ? 'text-red-500' : 'text-[#171B1C]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          <div className="h-[11px] bg-gray-50" />
        </div>
      ))}

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-lg">
            <p className="text-base font-semibold text-[#171B1C] mb-4">
              로그아웃 하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-md bg-[#F70071] py-2 text-sm font-medium text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
