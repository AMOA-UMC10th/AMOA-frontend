import logo from '../../assets/AMOA3.png';
import { useNavigate } from 'react-router-dom';
// alarm을 대문자 시작(AlarmIcon)으로 별칭 지정
import { alarm as AlarmIcon } from '../../assets/icons';

export default function HomeHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <img src={logo} alt="AMOA" className="h-10" />
      <button 
        aria-label="알림" 
        onClick={() => navigate('/mypage/notice')} 
        className="p-1 hover:opacity-70 transition-opacity"
      >
        {/* 대문자로 시작하는 컴포넌트로 사용 */}
        <AlarmIcon className="w-6 h-6" />
      </button>
    </div>
  );
}