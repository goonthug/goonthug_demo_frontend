import { useState } from "react";
import axios from "axios";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react";

export const DownloadGameDemo = observer(({ game, onStatusChange }) => {
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setError("");

    if (
      !authStore.token ||
      (authStore.user &&
        authStore.user.role !== "TESTER" &&
        authStore.user.role !== "UNKNOWN")
    ) {
      setError("Только тестеры могут скачивать демо");
      return;
    }

    setIsDownloading(true);

    try {
      console.log("Начинаем скачивание для игры:", game.id);

      const response = await axios.get(`/api/games/download/${game.id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      console.log("Ответ получен:", response.status, response.headers);

      let filename = `demo_${game.title || game.id}`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        console.log("Content-Disposition header:", contentDisposition);
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем URL объект
      window.URL.revokeObjectURL(url);

      if (game.status !== "в работе") {
        game.status = "в работе";
        if (onStatusChange) {
          onStatusChange(game.id, "в работе");
        }
      }
    } catch (err) {
      console.error("Ошибка при скачивании:", err);

      if (err.response?.status === 401) {
        setError("Ошибка авторизации. Пожалуйста, войдите в систему заново.");
      } else if (err.response?.status === 403) {
        setError("У вас нет прав для скачивания этого файла");
      } else if (err.response?.status === 404) {
        setError("Файл не найден");
      } else {
        setError(err.response?.data?.message || "Ошибка скачивания файла");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-white bg-red-600 p-2 rounded-md shadow-md mt-2">
          {error}
        </p>
      )}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`px-6 py-3 rounded-md font-bold transition-colors ${
          isDownloading
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isDownloading ? "Скачивание..." : "Взять в работу (скачать)"}
      </button>
    </div>
  );
});
