import React, { useState } from 'react';
import axios from 'axios';
import authStore from '../../components/stores/authStore';
import { useNavigate } from 'react-router-dom';

const UploadGamePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    file: null,
    minTesterRating: 0,
    requiresManualSelection: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('file', formData.file);
    data.append('minTesterRating', formData.minTesterRating);
    data.append('requiresManualSelection', formData.requiresManualSelection);

    try {
      await axios.post('http://localhost:8080/api/games/upload', data, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить игру');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Добавить игру</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название игры"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="block mb-4 p-2 border"
          required
        />
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
          className="block mb-4"
          required
        />
        <input
          type="number"
          placeholder="Минимальный рейтинг тестера"
          value={formData.minTesterRating}
          onChange={(e) => setFormData({ ...formData, minTesterRating: e.target.value })}
          className="block mb-4 p-2 border"
        />
        <label>
          <input
            type="checkbox"
            checked={formData.requiresManualSelection}
            onChange={(e) => setFormData({ ...formData, requiresManualSelection: e.target.checked })}
          />
          Требуется ручная выборка
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Загрузить
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default UploadGamePage;