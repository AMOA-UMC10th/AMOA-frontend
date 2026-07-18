import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import BottomNav from './components/common/BottomNav';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/HomePage';
import PhoneAuthPage from './pages/onboarding/PhoneAuthPage';
import SignupCompletePage from './pages/onboarding/SignupCompletePage';
import SplashPage from './pages/SplashPage';
import KakaoLoginPage from './pages/KakaoLoginPage';
import DesignPage from './pages/onboarding/DesignPage';
import RegionPage from './pages/onboarding/RegionPage';
import NicknamePage from './pages/onboarding/NicknamePage';
import ArtDetailPage from './pages/ArtDetailPage';
import ArtSearchPage from './pages/ArtSearchPage';
import WishListPage from './pages/WishListPage';
import ReservationPage from './pages/ReservationPage';

const NAV_VISIBLE_PATHS = ['/home', '/art-search', '/wishlist', '/my'];

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const showNav = NAV_VISIBLE_PATHS.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className={isAdmin ? 'pc-layout' : 'mobile-layout'}>
      {children}
      {showNav && <BottomNav />}
    </div>
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

function ArtDetailPageRoute() {
  const { cardId } = useParams();
  return <ArtDetailPage key={cardId} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<KakaoLoginPage />} />
          <Route path="/onboarding/design" element={<DesignPage />} />
          <Route path="/onboarding/region" element={<RegionPageRoute />} />
          <Route path="/onboarding/nickname" element={<NicknamePage />} />
          <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
          <Route path="/onboarding/complete" element={<SignupCompletePage />} />
          <Route path="/art-search" element={<ArtSearchPage />} />
          <Route path="/art/:cardId" element={<ArtDetailPageRoute />} />
          <Route
            path="/art/:cardId/reservation"
            element={<ReservationPage />}
          />
          <Route path="/wishlist" element={<WishListPage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
