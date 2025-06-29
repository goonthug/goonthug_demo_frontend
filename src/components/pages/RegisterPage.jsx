import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../context/AuthContext.jsx';

const RegisterPage = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TESTER');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { authStore } = useAuth();

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email обязателен';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Некорректный формат email';
    else if (email.length < 5 || email.length > 255) errors.email = 'Email должен содержать от 5 до 255 символов';
    if (!password.trim()) errors.password = 'Пароль обязателен';
    else if (password.length < 6) errors.password = 'Пароль должен содержать минимум 6 символов';
    if (role === 'COMPANY' && !companyName.trim()) errors.companyName = 'Название компании обязательно';
    else if (role === 'COMPANY' && companyName.length < 2) errors.companyName = 'Название компании должно содержать минимум 2 символа';
    if (role === 'TESTER' && !firstName.trim()) errors.firstName = 'Имя обязательно';
    if (role === 'TESTER' && !lastName.trim()) errors.lastName = 'Фамилия обязательна';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await authStore.register({
        email,
        password,
        role,
        companyName: role === 'COMPANY' ? companyName : null,
        firstName: role === 'TESTER' ? firstName : null,
        lastName: role === 'TESTER' ? lastName : null,
      });
      navigate('/login');
    } catch (err) {
      setValidationErrors({ email: err.message }); // Предполагаем, что серверная ошибка относится к email
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Создайте свою учетную запись</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
                }}
                className={`w-full px-4 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600`}
              />
              {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: '' });
                }}
                className={`w-full px-4 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600`}
              />
              {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
            </div>
            <div>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setValidationErrors({}); // Сбрасываем ошибки при смене роли
                }}
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
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (validationErrors.companyName) setValidationErrors({ ...validationErrors, companyName: '' });
                  }}
                  className={`w-full px-4 py-2 border ${validationErrors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600`}
                />
                {validationErrors.companyName && <p className="text-red-500 text-sm mt-1">{validationErrors.companyName}</p>}
              </div>
            )}
            {role === 'TESTER' && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (validationErrors.firstName) setValidationErrors({ ...validationErrors, firstName: '' });
                    }}
                    className={`w-full px-4 py-2 border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600`}
                  />
                  {validationErrors.firstName && <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (validationErrors.lastName) setValidationErrors({ ...validationErrors, lastName: '' });
                    }}
                    className={`w-full px-4 py-2 border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-600`}
                  />
                  {validationErrors.lastName && <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>}
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