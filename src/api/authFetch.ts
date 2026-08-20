let isRefreshing = false; // 현재 재발급 중인지 체크하는 플래그

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  const isLoginPage = window.location.pathname.includes('/login');
  const isReissueUrl = url.includes('/auth/reissue');

  if (response.status === 401 && !isLoginPage && !isReissueUrl) {
    if (isRefreshing) {
      return response;
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.clear();
      window.location.href = '/login';
      return response;
    }

    try {
      const refreshRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.result?.accessToken;
        const newRefreshToken = data.result?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          isRefreshing = false;

          const latestToken = localStorage.getItem('accessToken');
          const newHeaders = {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${latestToken}`,
          };

          return await fetch(url, { ...options, headers: newHeaders });
        }
      }
    } catch (error) {
      console.error('토큰 재발급 에러:', error);
    } finally {
      isRefreshing = false; // 어떤 상황이든 끝나면 플래그 초기화
    }

    localStorage.clear();
  }

  return response;
}
