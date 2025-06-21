import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../context/AuthContext.jsx';

const Header = observer(() => {
  const { authStore } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <span className="text-xl font-bold text-black">Game Tester</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-black font-bold hover:text-gray-700">Главная</Link>
          <Link to="/games" className="text-black hover:text-gray-700">Игры</Link>
          <Link to="/testers" className="text-black hover:text-gray-700">Тестеры</Link>
          <Link to="/companies" className="text-black hover:text-gray-700">Компании</Link>
          {authStore.token && (
            <Link to="/dashboard" className="text-black hover:text-gray-700">Профиль</Link>
          )}
        </nav>
        <div className="flex space-x-4">
          {authStore.token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          ) : (
            <>
              <Link to="/register">
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
                >
                  Регистрация
                </button>
              </Link>
              <Link to="/login">
                <button
                  type="button"
                  className="bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Вход
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;