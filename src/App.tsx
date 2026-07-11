import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import PhoneAuthPage from './pages/onboarding/PhoneAuthPage';
import SignupCompletePage from './pages/onboarding/SignupCompletePage';
import SplashPage from './pages/SplashPage';
import KakaoLoginPage from './pages/KakaoLoginPage';
import DesignPage from './pages/onboarding/DesignPage';
import RegionPage from './pages/onboarding/RegionPage';
import NicknamePage from './pages/onboarding/NicknamePage';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? 'pc-layout' : 'mobile-layout'}>{children}</div>
  );
}

function RegionPageRoute() {
  const navigate = useNavigate();

  return (
    <RegionPage
      onNext={() => navigate('/home')}
      onSkip={() => navigate('/home')}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<KakaoLoginPage />} />
          <Route path="/onboarding/design" element={<DesignPage />} />
          <Route path="/onboarding/region" element={<RegionPageRoute />} />
          <Route path='/onboarding/nickname' element={<NicknamePage />} />
          <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
          <Route path="/onboarding/complete" element={<SignupCompletePage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
