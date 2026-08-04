import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import LoginRequiredModal from '../components/common/LoginRequireModal';
import { isLoggedIn } from '../utils/auth';

interface RequireLoginContextValue {
  requireLogin: () => boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const RequireLoginContext = createContext<RequireLoginContextValue | null>(
  null,
);

interface RequireLoginProviderProps {
  children: ReactNode;
}

export function RequireLoginProvider({ children }: RequireLoginProviderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const requireLogin = useCallback((): boolean => {
    if (isLoggedIn()) {
      return true;
    }

    setIsLoginModalOpen(true);
    return false;
  }, []);

  const contextValue = useMemo(
    () => ({
      requireLogin,
      openLoginModal,
      closeLoginModal,
    }),
    [requireLogin, openLoginModal, closeLoginModal],
  );

  return (
    <RequireLoginContext.Provider value={contextValue}>
      {children}

      <LoginRequiredModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </RequireLoginContext.Provider>
  );
}

export function useRequireLogin(): RequireLoginContextValue {
  const context = useContext(RequireLoginContext);

  if (!context) {
    throw new Error(
      'useRequireLogin은 RequireLoginProvider 내부에서 사용해야 합니다.',
    );
  }

  return context;
}
