import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authStore from '../../components/stores/authStore';
import { Link } from 'react-router-dom';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log('Fetching games with token:', authStore.token);
       const response = await axios.get('http://localhost:8080/api/games', {
  headers: { Authorization: `Bearer ${authStore.token}` },
});
        console.log('Games response:', response.data);
        setGames(response.data);
      } catch (err) {
        console.error('Error fetching games:', err.response?.data || err.message);
        setError('Не удалось загрузить игры. Проверьте подключение к серверу.');
      } finally {
        setLoading(false);
      }
    };

    if (authStore.token) {
      fetchGames();
    } else {
      setError('Необходима авторизация');
      setLoading(false);
    }
  }, [authStore.token]);

  const handleTakeGame = async (gameId) => {
    if (!authStore.token || authStore.user?.role !== 'TESTER') {
      setError('Только тестеры могут взять игру в работу');
      return;
    }

    try {
      await axios.post(`/api/games/${gameId}/assign`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      alert('Игра взята в работу');
      setGames(games.map(game => 
        game.id === gameId ? { ...game, status: 'в работе' } : game
      ));
    } catch (err) {
      setError('Не удалось взять игру в работу');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Игры</h1>
      {authStore.token && authStore.user?.role === 'COMPANY' && (
        <Link to="/upload">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Добавить игру
          </button>
        </Link>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold">{game.title}</h2>
              <p>Файл: {game.fileName || 'Нет файла'}</p>
              <p>Минимальный рейтинг тестера: {game.minTesterRating || 'Не указан'}</p>
              <p>Требуется ручная выборка: {game.requiresManualSelection ? 'Да' : 'Нет'}</p>
              <p>Статус: {game.status || 'available'}</p>
              {authStore.token && authStore.user?.role === 'TESTER' && game.status === 'available' && (
                <button
                  onClick={() => handleTakeGame(game.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Взять в работу
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Нет доступных игр</p>
        )}
      </div>
    </div>
  );
};

export default GamesPage;