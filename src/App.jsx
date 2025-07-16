// src/App.jsx
import React, { useEffect } from 'react';
// Importe o BrowserRouter como Router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Páginas
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import SobrePage from './pages/SobrePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CheckoutPage from './pages/CheckoutPage'; // ADICIONE este import

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

// Criamos um componente interno para que ele possa usar o hook useLocation
function AppLayout() {
  const { pathname } = useLocation();

  // Efeito para rolar para o topo da página a cada mudança de rota
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/loja" element={<LojaPage />} />
      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />

      {/* Rota Protegida */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboardPage />} // Removido o <ProtectedRoute>
      />

      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

function App() {
  // Efeito para inicializar a biblioteca de animações
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    // O Router deve ser o componente de mais alto nível que envolve tudo que usa rotas
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
