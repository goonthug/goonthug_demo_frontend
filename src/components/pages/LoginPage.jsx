import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';
import React from 'react';

export const LoginPage = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authStore.login(username, password);
      navigate('/dashboard1');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
   <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
      {/* Заголовок */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-black"></span>
            <Link to="/"><span className="text-xl font-bold text-black">Game Tester</span></Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/register"><button className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors">
              Регистрация
            </button></Link>
            <Link to="/login">
              <button className="bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                Вход
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* основной контент */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Войдите в свою учетную запись</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="text-right">
              <a href="/forgot-password" className="text-red-600 text-sm hover:underline">
                 Забыли пароль?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Вход
            </button>
            <div className="text-center text-gray-600 text-sm">
              У вас нет учетной записи?{' '}
              <Link to="/register" className="text-red-600 hover:underline">
                Регистрация
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
});