import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: 백엔드 연동 후 실제 accessToken 검증 로직으로 교체
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        navigate('/home'); // 기존 로그인 유저 -> 홈으로 즉시 이동
      } else {
        navigate('/login'); // 미로그인 유저 -> 카카오 로그인 화면으로
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-black">
        AMOA.
      </h1>
      <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed">
        아트 디자인, 가격 한눈에 비교부터
        <br />
        예약까지 한번에
      </p>
    </div>
  );
}

export default SplashPage;
