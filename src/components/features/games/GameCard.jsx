import { DownloadGameDemo } from "./DownloadGameDemo";
import { FinalFeedback } from "../feedback/FinalFeedback";
import { CreateFeedback } from "../feedback/CreateFeedback";
import authStore from "../../stores/authStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const GameCard = observer(({ game, onGameStatusChange }) => {
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [showCreateFeedback, setShowCreateFeedback] = useState(false);

  const handleFinalFeedbackSuccess = () => {
    setShowFinalFeedback(false);
    if (onGameStatusChange) {
      onGameStatusChange(game.id, "завершена");
    }
  };

  const handleFeedbackSuccess = () => {
    setShowCreateFeedback(false);
  };
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
          <div className="space-y-2">
            {!showFinalFeedback && !showCreateFeedback ? (
              <div className="space-y-2">
                <button 
                  onClick={() => setShowFinalFeedback(true)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Завершить тестирование
                </button>
                <button 
                  onClick={() => setShowCreateFeedback(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Создать фидбек
                </button>
              </div>
            ) : showFinalFeedback ? (
              <div className="space-y-2">
                <FinalFeedback 
                  gameId={game.id} 
                  onSuccess={handleFinalFeedbackSuccess}
                />
                <button 
                  onClick={() => setShowFinalFeedback(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <CreateFeedback 
                  gameId={game.id} 
                  onSuccess={handleFeedbackSuccess}
                />
                <button 
                  onClick={() => setShowCreateFeedback(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
