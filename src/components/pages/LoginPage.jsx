import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../context/AuthContext.jsx';

const LoginPage = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { authStore } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Войдите в свою учетную запись</h1>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
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

export default LoginPage;