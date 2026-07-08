import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhoneAuthPage from './pages/onboarding/PhoneAuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding/phone" element={<PhoneAuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
