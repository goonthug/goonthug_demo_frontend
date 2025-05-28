import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {HomePage} from './components/pages/HomePage';
import {LoginPage} from './components/pages/LoginPage';
import {RegisterPage} from './components/pages/RegisterPage';
import {Dashboard} from './components/pages/Dashboard';
import {PrivateRoute} from './components/common/PrivateRoute';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard1" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
    </Routes>
  );
}

