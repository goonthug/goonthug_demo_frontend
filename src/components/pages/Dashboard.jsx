import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        setUserData(response.data);
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

    if (!authStore.token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const handleLogout = () => {
    authStore.logout();
    navigate('/');
  };

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
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Выйти
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Профиль пользователя</h2>
        <p><strong>Имя пользователя:</strong> {userData.username}</p>
        <p><strong>Роль:</strong> {userData.role}</p>
        {userData.role === 'TESTER' && (
          <>
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