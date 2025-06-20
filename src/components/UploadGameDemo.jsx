import React, { useState } from 'react';
import axios from 'axios';

const UploadGameDemo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      await axios.post('/api/games/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Демо загружено успешно');
    } catch (err) {
      setError(err.response?.data || 'Ошибка загрузки');
    }
  };

  return (
    <div>
      <h2>Загрузить демо</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="w-full p-2 bg-blue-500 text-white">
          Загрузить
        </button>
      </form>
    </div>
  );
};

export default UploadGameDemo;