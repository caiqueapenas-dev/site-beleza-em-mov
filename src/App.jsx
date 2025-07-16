// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import AdminLoginPage from './pages/AdminLoginPage'; 

import SobrePage from './pages/SobrePage';
// Importe aqui a futura página de Admin

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loja" element={<LojaPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;