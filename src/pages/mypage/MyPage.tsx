import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, type UserProfile } from '../../data/userdata/user';

interface MenuItem {
  label: string;
  path?: string;
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
    { label: '회원 탈퇴', path: '/mypage/withdraw', danger: true },
  ],
];

// 카카오 로그인 페이지 라우트 경로
const LOGIN_PATH = '/login';

function MyPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    // 내 정보 조회 API 호출
    getMyProfile()
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => {
        console.error('내 정보 조회 실패:', err);
        // 토큰 만료 등의 이유로 실패 시 비로그인 상태로 변경
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 표시 데이터 정의
  const profileImageUrl =
    isLoggedIn && userProfile?.profileImageUrl
      ? userProfile.profileImageUrl
      : 'https://via.placeholder.com/50';

  const nickname = isLoggedIn
    ? userProfile?.nickname || '회원'
    : '로그인을 해주세요';

  const email = isLoggedIn
    ? userProfile?.email || ''
    : '로그인 후 이용 가능한 서비스입니다.';

  // 클릭 이벤트 핸들러
  const handleAction = (path?: string) => {
    if (!isLoggedIn) {
      navigate(LOGIN_PATH);
      return;
    }
    if (path) {
      navigate(path);
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
    <div className="min-h-screen bg-white">
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
          onClick={() => handleAction('/mypage/edit')}
          className="w-[65px] h-[25px] flex items-center justify-center rounded-full border border-[#171B1C] text-sm font-medium whitespace-nowrap"
        >
          {isLoggedIn ? '정보관리' : '로그인'}
        </button>
      </section>
      <div className="h-[11px] bg-gray-50" />

      {MENU_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx}>
          {group.map((item) => (
            <button
              key={item.label}
              onClick={() => handleAction(item.path)}
              className="w-full flex items-center px-4 h-[50px] border-b border-[#E9EBEE] last:border-b-0 text-left"
            >
              <span className="text-[15px] text-[#171B1C]">{item.label}</span>
            </button>
          ))}
          <div className="h-[11px] bg-gray-50" />
        </div>
      ))}
    </div>
  );
}

export default MyPage;
