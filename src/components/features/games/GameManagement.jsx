import { useState } from "react";
import { observer } from "mobx-react";
import gameStore from "../../stores/gameStore";

export const GameManagement = observer(({ game, onGameUpdate }) => {
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showConfirmHide, setShowConfirmHide] = useState(false);

  const handleFinishDemo = async () => {
    try {
      await gameStore.finishDemo(game.id);
      setShowConfirmFinish(false);

      if (onGameUpdate) {
        onGameUpdate(game.id, "демо завершено");
      }

      alert("Демо-период игры успешно завершен!");
    } catch (error) {
      console.error("Ошибка при завершении демо-периода:", error);
    }
  };

  const handleHideGame = async () => {
    try {
      await gameStore.hideGame(game.id);
      setShowConfirmHide(false);

      if (onGameUpdate) {
        onGameUpdate(game.id, "скрыта");
      }

      alert("Игра успешно скрыта!");
    } catch (error) {
      console.error("Ошибка при скрытии игры:", error);
    }
  };

  const canFinishDemo = ["доступна", "в работе"].includes(game.status);

  const canHideGame = game.status !== "скрыта";

  return (
    <div className="space-y-2">
      {gameStore.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {gameStore.error}
        </div>
      )}

      {canFinishDemo && (
        <div>
          {!showConfirmFinish ? (
            <button
              onClick={() => setShowConfirmFinish(true)}
              disabled={gameStore.isFinishingDemo}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm disabled:bg-gray-400"
            >
              {gameStore.isFinishingDemo
                ? "Завершение..."
                : "Завершить демо-период"}
            </button>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 space-y-2">
              <p className="text-orange-800 text-sm">
                Вы уверены, что хотите завершить демо-период? После этого
                тестировщики не смогут больше брать игру в тестирование.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleFinishDemo}
                  disabled={gameStore.isFinishingDemo}
                  className="flex-1 bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 disabled:bg-gray-400"
                >
                  {gameStore.isFinishingDemo
                    ? "Завершение..."
                    : "Да, завершить"}
                </button>
                <button
                  onClick={() => setShowConfirmFinish(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/*       
      {canHideGame && (
        <div>
          {!showConfirmHide ? (
            <button
              onClick={() => setShowConfirmHide(true)}
              disabled={gameStore.isHiding}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm disabled:bg-gray-400"
            >
              {gameStore.isHiding ? "Скрытие..." : "Скрыть игру"}
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-2">
              <p className="text-red-800 text-sm">
                Вы уверены, что хотите скрыть игру? Это действие можно будет отменить позже.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleHideGame}
                  disabled={gameStore.isHiding}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                >
                  {gameStore.isHiding ? "Скрытие..." : "Да, скрыть"}
                </button>
                <button
                  onClick={() => setShowConfirmHide(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      */}
    </div>
  );
});
