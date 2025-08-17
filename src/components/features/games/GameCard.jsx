import { DownloadGameDemo } from "./DownloadGameDemo";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react-lite";

export const GameCard = observer(({ game, onGameStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="p-4">
        <h3 className="text-xl font-bold text-black mb-2">{game.title}</h3>
        <p className="text-gray-600 mb-1">
          Файл: {game.fileName || "Нет файла"}
        </p>
        <p className="text-gray-600 mb-4">
          Статус: {game.status || "доступна"}
        </p>
        {(authStore.user?.role === "TESTER" ||
          authStore.user?.role === "UNKNOWN") &&
          game.status === "доступна" && <DownloadGameDemo game={game} onStatusChange={onGameStatusChange} />}
        {authStore.user?.role === "TESTER" && game.status === "в работе" && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Завершить тестирование
          </button>
        )}
      </div>
    </div>
  );
});
