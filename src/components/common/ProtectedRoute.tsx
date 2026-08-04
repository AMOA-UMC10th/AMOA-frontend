import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRequireLogin } from '../../hooks/useReqireLogin';
import { isLoggedIn } from '../../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { openLoginModal } = useRequireLogin();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      openLoginModal();
    }
  }, [loggedIn, openLoginModal]);

  if (!loggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
