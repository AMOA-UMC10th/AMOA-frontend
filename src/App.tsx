import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhoneAuthPage from './pages/onboarding/PhoneAuthPage';
import TermsPage from './pages/onboarding/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
        <Route path="/onboarding/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
