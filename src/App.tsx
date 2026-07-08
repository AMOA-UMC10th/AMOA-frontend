import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout'; // AdminLayout 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;