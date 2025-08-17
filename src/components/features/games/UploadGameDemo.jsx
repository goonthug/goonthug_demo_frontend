import { useState } from "react";
import axios from "axios";
import authStore from "../../stores/authStore";

export const UploadGameDemo = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    if (
      !authStore.token ||
      (authStore.user &&
        authStore.user.role !== "COMPANY" &&
        authStore.user.role !== "UNKNOWN")
    ) {
      setError("Только компании могут загружать демо");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      await axios.post("/api/games/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      setFile(null);
      setTitle("");
      setError("");
      if (onUploadSuccess) onUploadSuccess();
      alert("Демо загружено успешно");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Ошибка загрузки. Убедитесь, что все данные корректны."
      );
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-white bg-red-600 p-4 rounded-md shadow-md mb-4">
          {error}
        </p>
      )}
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
      <button
        onClick={handleSubmit}
        className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors"
      >
        Загрузить
      </button>
    </div>
  );
};
