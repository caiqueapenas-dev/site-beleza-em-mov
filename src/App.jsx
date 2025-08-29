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

// Páginas
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import SobrePage from './pages/SobrePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPage from './pages/ProductPage';

// Componentes e Contexto
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider, useCart } from './context/CartContext';
import Cart from './components/Cart';
import Notification from './components/Notification'; // Importa a notificação

// Componente interno para usar o hook useLocation e o contexto do carrinho
function AppLayout() {
  const { pathname } = useLocation();
  const { notification } = useCart(); // Pega o estado da notificação do contexto

  // Efeito para rolar para o topo da página a cada mudança de rota
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/loja" element={<LojaPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />

        {/* Rota protegida */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Cart />
      {/* Renderiza a notificação globalmente */}
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />
    </>
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
    <Router>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </Router>
  );
}

export default App;