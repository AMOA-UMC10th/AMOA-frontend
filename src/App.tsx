import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TermsPage from './pages/onboarding/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
