// src/App.jsx
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// páginas
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import SobrePage from './pages/SobrePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPage from './pages/ProductPage'; // nova página

// componentes e contexto
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

// componente interno para usar o hook useLocation
function AppLayout() {
  const { pathname } = useLocation();

  // efeito para rolar para o topo da página a cada mudança de rota
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/loja" element={<LojaPage />} />
      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/produto/:id" element={<ProductPage />} />{' '}

      {/* rota protegida */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  // efeito para inicializar a biblioteca de animações
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    // o router e o cartprovider envolvem toda a aplicação
    <Router>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </Router>
  );
}

export default App;