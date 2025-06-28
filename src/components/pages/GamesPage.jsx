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
      setError(err.response?.data?.message || 'Не удалось взять игру в работу.');
      if (err.response) {
        console.log('Server response:', err.response.data);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-600 p-8">{error}</div>;

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-black mb-6">Игры</h1>
          {!authStore.token && <p className="text-white bg-red-600 p-4 rounded-md shadow-md mb-8">Пожалуйста, авторизуйтесь для доступа к играм.</p>}
          {authStore.token && (
            <div>
              {(authStore.user?.role === 'COMPANY' || authStore.user?.role === 'UNKNOWN') && (
                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-3xl font-bold text-[#333333] mb-6">Загрузить новую игру</h3>
                  <UploadGameDemo onUploadSuccess={fetchGames} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {games.length > 0 ? (
                  games.map((game) => (
                    <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-black mb-2">{game.title}</h3>
                        <p className="text-gray-600 mb-1">Файл: {game.fileName || 'Нет файла'}</p>
                        <p className="text-gray-600 mb-4">Статус: {game.status || 'available'}</p>
                        {(authStore.user?.role === 'TESTER' || authStore.user?.role === 'UNKNOWN') && game.status === 'available' && (
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleTakeGame(game.id)}
                              className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
                            >
                              Взять в работу
                            </button>
                            <DownloadGameDemo gameId={game.id} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 mt-4">Нет доступных игр</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
});

// Компонент UploadGameDemo внутри GamesPage
const UploadGameDemo = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
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

    try {
      await axios.post('http://localhost:8080/api/games/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      setFile(null);
      setTitle('');
      setError('');
      if (onUploadSuccess) onUploadSuccess();
      alert('Демо загружено успешно');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка загрузки. Убедитесь, что все данные корректны.');
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-white bg-red-600 p-4 rounded-md shadow-md mb-4">{error}</p>}
      <label className="block">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-md text-gray-800 file:hidden"
          required
        />
      </label>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-red-600"
        required
      />
      <button onClick={handleSubmit} className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
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
      const response = await axios.get(`http://localhost:8080/api/games/download/${gameId}`, {
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
    <div className="space-y-2">
      {error && <p className="text-white bg-red-600 p-2 rounded-md shadow-md mt-2">{error}</p>}
      <button
        onClick={handleDownload}
        className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
      >
        Скачать демо
      </button>
    </div>
  );
};

export default GamesPage;