import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';

const RegisterPage = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TESTER');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.register({
        username,
        password,
        role,
        companyName: role === 'COMPANY' ? companyName : null,
        firstName: role === 'TESTER' ? firstName : null,
        lastName: role === 'TESTER' ? lastName : null,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
      {/* Заголовок */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-black"></span>
            <Link to="/">
              <span className="text-xl font-bold text-black">Game Tester</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/register">
              <button className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors">
                Регистрация
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                Вход
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Создайте свою учетную запись</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
              />
            </div>
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
              >
                <option value="TESTER">Тестер</option>
                <option value="COMPANY">Компания</option>
              </select>
            </div>
            {role === 'COMPANY' && (
              <div>
                <input
                  type="text"
                  placeholder="Название компании"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
                />
              </div>
            )}
            {role === 'TESTER' && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Зарегистрироваться
            </button>
            <p className="text-center text-gray-600 text-sm">
              Регистрируясь, вы соглашаетесь с нашими{' '}
              <a href="/terms" className="text-red-600 hover:underline">условиями обслуживания</a> и{' '}
              <a href="/privacy" className="text-red-600 hover:underline">политикой конфиденциальности</a>.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
});

export default RegisterPage;