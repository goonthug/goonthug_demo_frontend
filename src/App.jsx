import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import UploadGameDemo from './components/UploadGameDemo';
import DownloadGameDemo from './components/DownloadGameDemo';
import { HomePage } from './components/pages/HomePage';
import Dashboard from './components/pages/Dashboard';
import GamesPage from './components/pages/GamesPage';
import Header from './components/Header.jsx'; // Изменил расширение
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/upload" element={<UploadGameDemo />} />
        <Route path="/download" element={<DownloadGameDemo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="*" element={<div>404 - Страница не найдена</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;