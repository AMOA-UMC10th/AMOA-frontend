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
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

import { RequireLoginProvider } from './hooks/useReqireLogin';

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
import WithdrawPage from './pages/mypage/WithdrawPage';
import TermsDetailView from './components/mypage/TermsDetailView';
import NoticeList from './components/mypage/NoticeList';
import NotificationToggle from './components/mypage/NotificationToggle';
import MyProfileEditPage from './pages/mypage/MyProfileEditPage';
import MyRegionReconfigPage from './pages/mypage/MyRegionReconfigPage';
import MyMoodReconfigPage from './pages/mypage/MyMoodReconfigPage';

const NAV_VISIBLE_PATHS = ['/home', '/art-search', '/wishlist', '/mypage'];

const NAV_HIDDEN_PATHS = [
  '/mypage/settings',
  '/mypage/notice',
  '/mypage/terms',
  '/mypage/withdraw',
  '/mypage/designre',
  '/mypage/regionre',
];

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const showNav =
    NAV_VISIBLE_PATHS.some((path) => location.pathname.startsWith(path)) &&
    !NAV_HIDDEN_PATHS.some((path) => location.pathname.startsWith(path));

  return (
    <div className={isAdmin ? 'pc-layout' : 'mobile-layout'}>
      {children}
      {showNav && <BottomNav />}
    </div>
  );
}

function RegionPageRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  const goNext = (regionIds: number[]) => {
    navigate('/onboarding/nickname', {
      state: {
        ...location.state,
        regionIds,
      },
    });
  };

  return (
    <RegionPage
      onNext={(regions) =>
        goNext(
          regions
            .map((region) => region.regionId)
            .filter((regionId): regionId is number => regionId != null),
        )
      }
      onSkip={() => goNext([])}
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

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/admin" element={<AdminLayout />} />

          <Route path="/home" element={<HomePage />} />

          <Route path="/login" element={<KakaoLoginPage />} />

          <Route path="/SplashPage" element={<SplashPage />} />

          <Route path="/art-search" element={<ArtSearchPage />} />

          <Route path="/art-detail/:cardId" element={<ArtDetailPageRoute />} />

          <Route path="/shop/:shopId" element={<NailShopDetailPageRoute />} />

          <Route path="/onboarding/design" element={<DesignPage />} />

          <Route path="/onboarding/region" element={<RegionPageRoute />} />

          <Route path="/onboarding/nickname" element={<NicknamePage />} />

          <Route path="/onboarding/phone" element={<PhoneAuthPage />} />

          <Route path="/onboarding/complete" element={<SignupCompletePage />} />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/art/:cardId/reservation"
            element={
              <ProtectedRoute>
                <ReservationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/reservations"
            element={
              <ProtectedRoute>
                <MyReservationListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservations/:reservationId"
            element={
              <ProtectedRoute>
                <MyReservationDetailPageRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/withdraw"
            element={
              <ProtectedRoute>
                <WithdrawPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/terms"
            element={
              <ProtectedRoute>
                <TermsDetailView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/notice"
            element={
              <ProtectedRoute>
                <NoticeList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/settings"
            element={
              <ProtectedRoute>
                <NotificationToggle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/edit"
            element={
              <ProtectedRoute>
                <MyProfileEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/designre"
            element={
              <ProtectedRoute>
                <MyMoodReconfigPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage/regionre"
            element={
              <ProtectedRoute>
                <MyRegionReconfigPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </LayoutWrapper>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RequireLoginProvider>
        <AppRoutes />
      </RequireLoginProvider>
    </BrowserRouter>
  );
}

export default App;
