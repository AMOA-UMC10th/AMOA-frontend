import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import PhoneAuthPage from './pages/onboarding/PhoneAuthPage';

// 레이아웃을 주소에 따라 동적으로 결정하는 컴포넌트
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? 'pc-layout' : 'mobile-layout'}>
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;