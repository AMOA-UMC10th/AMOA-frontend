import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DesignPage from "./pages/onboarding/DesignPage";
import RegionPage from "./pages/onboarding/RegionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/design" replace />} />
        <Route path="/onboarding/design" element={<DesignPage />} />
        <Route path="/onboarding/region" element={<RegionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
