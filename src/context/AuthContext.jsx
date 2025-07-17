// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor (Provider) - O componente que vai "prover" os dados
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado para guardar se o usuário está logado

  // Função de login (por enquanto, com dados fixos)
  const login = (email, password) => {
    // Lógica de autenticação "fake"
    if (email === 'a@a' && password === 'a') {
      const userData = { email: 'a@a', name: 'a' };
      setUser(userData); // Atualiza o estado para logado
      return true;
    }
    return false;
  };

  // Função de logout
  const logout = () => {
    setUser(null); // Limpa o estado do usuário
  };

  const isAuthenticated = !!user; // Converte o estado do usuário em true/false

  // O valor que será compartilhado com todos os componentes filhos
  const value = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Cria um Hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}
