// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authStore, setAuthStore] = useState({ token: localStorage.getItem('token') || null });

  return (
    <AuthContext.Provider value={{ authStore, setAuthStore }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);