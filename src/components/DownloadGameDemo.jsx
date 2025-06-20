import React, { useState } from 'react';
import axios from 'axios';

const DownloadGameDemo = () => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/games/demo/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `demo_${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Ошибка скачивания');
    }
  };

  return (
    <div>
      <h2>Скачать демо</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="ID демо"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="w-full p-2 mb-2 border"
      />
      <button
        onClick={handleDownload}
        className="w-full p-2 bg-blue-500 text-white"
      >
        Скачать
      </button>
    </div>
  );
};

export default DownloadGameDemo;