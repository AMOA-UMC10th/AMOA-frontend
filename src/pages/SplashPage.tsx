///서버랑 연결 확인용 (나중에 수정)


import { useEffect, useState } from 'react';
import axios from 'axios';

function SplashPage() {
  const [statusMessage, setStatusMessage] = useState('API 연결 확인 중...');

  useEffect(() => {
    const testApiConnection = async () => {
      // 1. .env 및 로컬 스토리지에서 값 가져오기
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const envToken = import.meta.env.VITE_ACCESS_TOKEN;
      const localToken = localStorage.getItem('accessToken');

      const rawToken = localToken || envToken;

      console.log('📌 [1] 설정된 Base URL:', baseUrl);
      console.log('📌 [2] 불러온 토큰:', rawToken);

      // 토큰이 아예 없는 경우
      if (!rawToken) {
        const msg = '❌ 토큰이 존재하지 않습니다. (.env 파일의 VITE_ACCESS_TOKEN을 확인해 주세요)';
        console.warn(msg);
        setStatusMessage(msg);
        return;
      }

      // 'Bearer ' 공백 포함 처리
      const authHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

      try {
        // 2. 백엔드 API 호출 테스트
        // ⚠️ '/api/v1/users/me' 경로를 백엔드의 실제 API 경로로 맞춰주세요!
        const response = await axios.get(`${baseUrl}/api/v1/users/me`, {
          headers: {
            Authorization: authHeader,
          },
        });

        console.log('✅ [3] API 요청 성공! 백엔드 응답 데이터:', response.data);
        setStatusMessage('✅ API 통신 성공! 콘솔(F12) 데이터를 확인하세요.');
      } catch (error: any) {
        const errorData = error.response?.data || error.message;
        console.error('❌ [3] API 요청 실패 (에러 내용):', errorData);
        setStatusMessage(`❌ 통신 실패: ${JSON.stringify(errorData)}`);
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-black">
        AMOA.
      </h1>
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 max-w-sm text-center break-all">
        {statusMessage}
      </div>
    </div>
  );
}

export default SplashPage;