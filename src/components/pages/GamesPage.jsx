import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authStore from '../../components/stores/authStore';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const GamesPage = observer(() => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/games', {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      console.log('Fetched games:', response.data);
      setGames(response.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError('Не удалось загрузить игры. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Auth store state:', authStore);
    console.log('Token:', authStore.token);
    console.log('User:', authStore.user);
    if (authStore.token) {
      if (!authStore.user) {
        authStore.fetchUserProfile().then(() => {
          fetchGames();
        });
      } else {
        fetchGames();
      }
    } else {
      setError('Необходима авторизация');
      setLoading(false);
    }
  }, [authStore.token]);

  const handleTakeGame = async (gameId) => {
    if (!authStore.token) {
      setError('Необходима авторизация');
      return;
    }
    // Проверяем роль из токена, если jwt-decode доступен
    let role = 'UNKNOWN';
    if (authStore.user && authStore.user.role) {
      role = authStore.user.role;
    } else if (authStore.token) {
      try {
        const jwtDecode = require('jwt-decode');
        const decodedToken = jwtDecode(authStore.token);
        role = decodedToken.role || 'UNKNOWN';
      } catch (e) {
        console.error('Failed to decode token for role:', e);
        // Если декодирование не удалось, полагаемся на токен для бэкенда
      }
    }
    if (role !== 'TESTER' && role !== 'UNKNOWN') {
      setError('Только тестеры могут взять игру в работу');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/games/${gameId}/assign`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      await fetchGames();
      alert('Игра взята в работу');
    } catch (err) {
      console.error('Assign error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Не удалось взять игру в работу. Проверьте условия (например, рейтинг тестера или статус игры).');
      // Логируем полный ответ для отладки
      if (err.response) {
        console.log('Server response:', err.response.data);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Игры</h1>
      {!authStore.token && <p className="text-red-500">Пожалуйста, авторизуйтесь для доступа к играм.</p>}
      {authStore.token && (
        <div>
          {(authStore.user?.role === 'COMPANY' || authStore.user?.role === 'UNKNOWN') && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Загрузить новую игру</h3>
              <UploadGameDemo onUploadSuccess={fetchGames} />
            </div>
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
                  {(authStore.user?.role === 'TESTER' || authStore.user?.role === 'UNKNOWN') && game.status === 'available' && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleTakeGame(game.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Взять в работу
                      </button>
                      <DownloadGameDemo gameId={game.id} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Нет доступных игр</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// Компонент UploadGameDemo внутри GamesPage
const UploadGameDemo = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [minTesterRating, setMinTesterRating] = useState('');
  const [requiresManualSelection, setRequiresManualSelection] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл для загрузки.');
      return;
    }
    if (!authStore.token || (authStore.user && authStore.user.role !== 'COMPANY' && authStore.user.role !== 'UNKNOWN')) {
      setError('Только компании могут загружать демо');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (minTesterRating) {
      const rating = parseInt(minTesterRating, 10);
      if (isNaN(rating)) {
        setError('Минимальный рейтинг должен быть целым числом.');
        return;
      }
      formData.append('minTesterRating', rating);
    }
    formData.append('requiresManualSelection', requiresManualSelection);

    try {
      await axios.post('http://localhost:8080/api/games/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      setFile(null);
      setTitle('');
      setMinTesterRating('');
      setRequiresManualSelection(false);
      setError('');
      if (onUploadSuccess) onUploadSuccess();
      alert('Демо загружено успешно');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка загрузки. Убедитесь, что все данные корректны.');
    }
  };

  return (
    <div className="mb-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
        required
      />
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-2 border"
        required
      />
      <input
        type="number"
        step="1"
        placeholder="Минимальный рейтинг тестера (опционально)"
        value={minTesterRating}
        onChange={(e) => setMinTesterRating(e.target.value)}
        className="w-full p-2 mb-2 border"
      />
      <label>
        <input
          type="checkbox"
          checked={requiresManualSelection}
          onChange={(e) => setRequiresManualSelection(e.target.checked)}
          className="mr-2"
        />
        Требуется ручная выборка
      </label>
      <button onClick={handleSubmit} className="w-full p-2 bg-blue-500 text-white rounded mt-2">
        Загрузить
      </button>
    </div>
  );
};

// Компонент DownloadGameDemo внутри GamesPage
const DownloadGameDemo = ({ gameId }) => {
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!authStore.token || (authStore.user && authStore.user.role !== 'TESTER' && authStore.user.role !== 'UNKNOWN')) {
      setError('Только тестеры могут скачивать демо');
      return;
    }

    try {
      const response = await axios.get(`/api/games/demo/download/${gameId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `demo_${gameId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка скачивания');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleDownload}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Скачать демо
      </button>
    </div>
  );
};

export default GamesPage;