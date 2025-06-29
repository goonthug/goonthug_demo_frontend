import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';

const Dashboard = () => {
  const [userData, setUserData] = useState(authStore.user || null); // Используем данные из authStore
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authStore.token) {
        navigate('/login');
        return;
      }
      try {
        if (!authStore.user) {
          await authStore.fetchUserProfile(); // Обновляем данные, если их нет
        }
        setUserData(authStore.user);
      } catch (err) {
        if (err.response?.status === 401) {
          authStore.logout();
          navigate('/login');
        } else {
          setError('Не удалось загрузить данные пользователя');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Личный кабинет</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Роль:</strong> {userData.role}</p>
        {userData.role === 'TESTER' && (
          <>
            <p><strong>Имя:</strong> {userData.firstName || 'Не указано'}</p>
            <p><strong>Фамилия:</strong> {userData.lastName || 'Не указано'}</p>
            <h3 className="text-xl font-bold mt-6 mb-4">История тестов</h3>
            {userData.tests?.length > 0 ? (
              <ul>
                {userData.tests.map((test) => (
                  <li key={test.id} className="mb-2">
                    <p><strong>Игра:</strong> {test.gameTitle}</p>
                    <p><strong>Оценка:</strong> {test.rating}</p>
                    <p><strong>Дата:</strong> {new Date(test.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет истории тестов</p>
            )}
          </>
        )}
        {userData.role === 'COMPANY' && (
          <>
            <p><strong>Название компании:</strong> {userData.companyName || 'Не указано'}</p>
            <h3 className="text-xl font-bold mt-6 mb-4">Оцененные игры</h3>
            {userData.ratedGames?.length > 0 ? (
              <ul>
                {userData.ratedGames.map((game) => (
                  <li key={game.id} className="mb-2">
                    <p><strong>Игра:</strong> {game.title}</p>
                    <p><strong>Средняя оценка:</strong> {game.averageRating}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет оцененных игр</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;