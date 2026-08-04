export const isLoggedIn = (): boolean => {
  return Boolean(localStorage.getItem('accessToken'));
};

export const isGuest = (): boolean => {
  return !isLoggedIn();
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tempToken');
  localStorage.removeItem('memberId');
  localStorage.removeItem('email');
  localStorage.removeItem('nickName');
  localStorage.removeItem('kakaoEmail');
  localStorage.removeItem('isGuest');
};

export const clearLoginUserStorage = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tempToken');
  localStorage.removeItem('memberId');
  localStorage.removeItem('email');
  localStorage.removeItem('nickName');
  localStorage.removeItem('kakaoEmail');
};

export const setGuestMode = (): void => {
  clearLoginUserStorage();
  localStorage.setItem('isGuest', 'true');
};

export const clearGuestMode = (): void => {
  localStorage.removeItem('isGuest');
};
