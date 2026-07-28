import { useNavigate } from 'react-router-dom';
import { mockSettingData } from '../../data/mockupdata/userData';

interface MenuItem {
  label: string;
  path?: string;
  danger?: boolean;
}

const MENU_GROUPS: MenuItem[][] = [
  [{ label: '예약 내역', path: '/mypage/reservations' }],
  [
    { label: '선호 디자인 재설정', path: '/onboarding/design' },
    { label: '관심 지역 재설정', path: '/onboarding/region' },
  ],
  [
    { label: '알림설정', path: '/mypage/settings' },
    { label: '공지사항', path: '/mypage/notice' },
    { label: '이용약관', path: '/mypage/terms' },
    { label: '회원 탈퇴', path: '/mypage/withdraw', danger: true },
  ],
];

function MyPage() {
  const navigate = useNavigate();
  const { profileImageUrl, nickname, email } = mockSettingData.result;

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-center h-14 border-b border-gray-100">
        <h1 className="text-lg font-bold">마이페이지</h1>
      </header>

      <section className="flex items-center justify-between px-[17px] py-[18px] border-b-[11px] border-gray-50">
        <div className="flex items-center gap-4">
          <img
            src={profileImageUrl}
            alt={`${nickname} 프로필 이미지`}
            className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
          />
          <div>
            <p className="text-[15px] font-semibold text-[#171B1C]">{nickname}</p>
            <p className="text-[11px] font-medium text-[#ADB0B5]">{email}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/mypage/edit')}
          className="w-[65px] h-[25px] flex items-center justify-center rounded-full border border-[#171B1C] text-sm font-medium whitespace-nowrap"
        >
          정보관리
        </button>
      </section>

      {MENU_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx} className="border-b-[11px] border-gray-50 last:border-b-0">
          {group.map((item) => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className="w-full flex items-center px-4 h-[50px] border-b border-[#E9EBEE] last:border-b-0 text-left"
            >
              <span
                className={`text-[15px] ${
                  item.danger ? 'text-[#ADB0B5]' : 'text-[#171B1C]'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyPage;