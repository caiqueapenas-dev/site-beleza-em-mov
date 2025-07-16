// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import SobrePage from './pages/SobrePage';
// Importe aqui a futura página de Admin

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loja" element={<LojaPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        {/* Adicionaremos a rota /admin depois */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;