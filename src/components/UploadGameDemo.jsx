import React, { useState } from 'react';
import axios from 'axios';
import authStore from './stores/authStore.js'; // Исправлен путь

const UploadGameDemo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authStore.token || authStore.user?.role !== 'COMPANY') {
      setError('Только компании могут загружать демо');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      await axios.post('/api/games/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      alert('Демо загружено успешно');
      setFile(null);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки');
    }
  };

  return (
    <div>
      <h2>Загрузить демо</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <button onClick={handleSubmit} className="w-full p-2 bg-blue-500 text-white">
          Загрузить
        </button>
      </div>
    </div>
  );
};

export default UploadGameDemo;