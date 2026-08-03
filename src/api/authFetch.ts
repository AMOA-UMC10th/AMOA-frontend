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
    
    const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reissue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      localStorage.setItem('accessToken', accessToken);

      headers['Authorization'] = `Bearer ${accessToken}`;
      return await fetch(url, { ...options, headers });
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  return response;
}