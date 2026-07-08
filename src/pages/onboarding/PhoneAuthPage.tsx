//전화번호 입력 페이지 A105

import { useNavigate } from 'react-router-dom';
import PhoneInput from '../../components/onboarding/PhoneInput';

export default function PhoneAuthPage() {
  const navigate = useNavigate();

  const handleVerified = () => {
    navigate('/onboarding/terms'); // 인증 완료되면 A106(약관 동의) 페이지로 이동
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">전화번호 인증</h1>
      <PhoneInput onVerified={handleVerified} />
    </div>
  );
}
