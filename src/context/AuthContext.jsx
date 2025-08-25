// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. cria o contexto
const AuthContext = createContext(null);

// 2. cria o provedor (provider)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // estado para guardar se o usuário está logado

  // função de login (agora assíncrona para chamar a api)
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // atualiza o estado para logado com os dados do usuário
        return true;
      }
      return false;
    } catch (error) {
      console.error('falha ao tentar fazer login:', error);
      return false;
    }
  };

  // função de logout
  const logout = () => {
    setUser(null); // limpa o estado do usuário
  };

  const isAuthenticated = !!user; // converte o estado do usuário em true/false

  // o valor que será compartilhado
  const value = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. cria um hook customizado
export function useAuth() {
  return useContext(AuthContext);
}