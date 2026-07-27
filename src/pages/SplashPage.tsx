///서버랑 연결 확인용 (나중에 수정)

import { useEffect, useState } from 'react';
import axios from 'axios';

function SplashPage() {
  const [statusMessage, setStatusMessage] = useState('API 연결 확인 중...');

  useEffect(() => {
    const testApiConnection = async () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const envToken = import.meta.env.VITE_ACCESS_TOKEN;
      const localToken = localStorage.getItem('accessToken');
      const rawToken = localToken || envToken;

      console.log('📌 [1] 설정된 Base URL:', baseUrl);
      console.log('📌 [2] 불러온 토큰:', rawToken);

      // ---------------------------------------------------------
      // 디자인태그 목록 조회 API 하나로 서버 연결 확인
      // GET /api/admin/shops/designtag (샵 등록 시 선택 가능한 디자인태그 목록)
      // ---------------------------------------------------------
      try {
        const headers: Record<string, string> = {};
        if (rawToken) {
          headers.Authorization = rawToken.startsWith('Bearer ')
            ? rawToken
            : `Bearer ${rawToken}`;
        }

        const response = await axios.get(`${baseUrl}/admin/shops/designtag`, {
          headers,
        });

        console.log('✅ 디자인태그 목록 조회 성공! 응답 데이터:', response.data);
        setStatusMessage('✅ API 통신 성공! 콘솔(F12)에서 디자인태그 목록을 확인하세요.');
      } catch (error: any) {
        if (error.response) {
          // 서버가 응답을 보냈다는 것 자체는 연결은 됐다는 뜻 (401/403/500 등)
          const errorData = error.response.data;
          console.error('❌ 디자인태그 목록 조회 실패:', errorData);
          setStatusMessage(
            `❌ 요청 실패 (status ${error.response.status}): ${JSON.stringify(errorData)}`
          );
        } else {
          // 응답 자체가 없는 경우 = 네트워크/연결 문제 (CORS, 서버 다운, 잘못된 baseUrl 등)
          console.error('❌ 서버 연결 실패 (응답 없음):', error.message);
          setStatusMessage(`❌ 서버 연결 실패 (응답 없음): ${error.message}`);
        }
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