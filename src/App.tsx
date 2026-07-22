import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
  Navigate,
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
import MyReservationListPage from './pages/mypage/MyReservationListPage';
import MyReservationDetailPage from './pages/mypage/MyReservationDetailPage';
import NailShopDetailPage from './pages/NailShopDetailPage';
import MyPage from './pages/mypage/MyPage';

const NAV_VISIBLE_PATHS = ['/home', '/art-search', '/wishlist', '/mypage'];

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

function MyReservationDetailPageRoute() {
  const { reservationId } = useParams();
  return <MyReservationDetailPage key={reservationId} />;
}
function NailShopDetailPageRoute() {
  const { shopId } = useParams();
  return <NailShopDetailPage key={shopId} />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<KakaoLoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/onboarding/design" element={<DesignPage />} />
          <Route path="/onboarding/region" element={<RegionPageRoute />} />
          <Route path="/onboarding/nickname" element={<NicknamePage />} />
          <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
          <Route path="/onboarding/complete" element={<SignupCompletePage />} />
          <Route path="/art-search" element={<ArtSearchPage />} />
          <Route path="/art-detail/:cardId" element={<ArtDetailPageRoute />} />
          <Route path="/art/:cardId/reservation" element={<ReservationPage />}/>
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/mypage/reservations" element={<MyReservationListPage />} />
          <Route path="/reservations/:reservationId" element={<MyReservationDetailPageRoute />} />
          <Route path="/shop/:shopId" element={<NailShopDetailPageRoute />} />
          <Route path="/SplashPage" element={<SplashPage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
