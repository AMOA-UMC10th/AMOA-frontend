export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reissue`, {
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
      console.error('토큰 재발급 중 에러 발생:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  return response;
}
