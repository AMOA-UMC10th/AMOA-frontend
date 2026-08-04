export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  // 🛑 만약 현재 로그인 페이지이거나, reissue 자체를 요청한 거라면 401이 나도 재발급 시도 안 함
  const isLoginPage = window.location.pathname.includes('/login');
  const isReissueUrl = url.includes('/auth/reissue');

  if (response.status === 401 && !isLoginPage && !isReissueUrl) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // 리프레시 토큰이 아예 없다면 굳이 reissue 요청을 안 보내고 바로 로그인 페이지로
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = '/login';
      return response;
    }

    try {
      const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.result?.accessToken;
        const newRefreshToken = data.result?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          headers['Authorization'] = `Bearer ${newAccessToken}`;
          return await fetch(url, { ...options, headers });
        }
      }
    } catch (error) {
      console.error('토큰 재발급 에러:', error);
    }

    // 재발급 실패 시에만 정리
    localStorage.clear();
    window.location.href = '/login';
  }

  return response;
}
