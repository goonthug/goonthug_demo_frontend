import React, { createContext, useContext } from 'react';
import authStore from '../components/stores/authStore.js'; // Исправлен путь

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ authStore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};