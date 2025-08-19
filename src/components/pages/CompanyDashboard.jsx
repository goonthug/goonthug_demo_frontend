import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import authStore from "../stores/authStore";
import gameStore from "../stores/gameStore";
import feedbackStore from "../stores/feedbackStore";
import { GameCard } from "../features/games/GameCard";
import { FeedbackList } from "../features/feedback/FeedbackList";

const CompanyDashboard = observer(() => {
  const [selectedGameId, setSelectedGameId] = useState("");
  const [activeTab, setActiveTab] = useState("games");

  useEffect(() => {
    if (authStore.token && authStore.user?.role === "COMPANY") {
      gameStore.fetchGames();
    }
  }, [authStore.token]);

  const handleGameStatusChange = (gameId, newStatus) => {
    gameStore.updateGameStatus(gameId, newStatus);
  };

  const handleViewFeedbacks = (gameId) => {
    setSelectedGameId(gameId);
    setActiveTab("feedbacks");
    feedbackStore.fetchGameFeedbacks(gameId);
  };

  if (!authStore.token) {
    return (
      <div className="bg-[#F9F9F9] min-h-screen">
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-6">
                Панель управления компании
              </h1>
              <p className="text-red-600 bg-red-100 p-4 rounded-md shadow-md">
                Пожалуйста, авторизуйтесь для доступа к панели управления.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (authStore.user?.role !== "COMPANY") {
    return (
      <div className="bg-[#F9F9F9] min-h-screen">
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-6">
                Доступ запрещен
              </h1>
              <p className="text-red-600 bg-red-100 p-4 rounded-md shadow-md">
                Эта страница доступна только для компаний.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-black mb-6">
            Панель управления компании
          </h1>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("games")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "games"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Мои игры
                </button>
                <button
                  onClick={() => setActiveTab("feedbacks")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "feedbacks"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Фидбеки
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "stats"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Статистика
                </button>
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === "games" && (
              <div>
                {gameStore.isLoading ? (
                  <div className="text-center py-8">Загрузка игр...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gameStore.games.length > 0 ? (
                      gameStore.games.map((game) => (
                        <div key={game.id} className="relative">
                          <GameCard
                            game={game}
                            onGameStatusChange={handleGameStatusChange}
                          />
                          <button
                            onClick={() => handleViewFeedbacks(game.id)}
                            className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Фидбеки
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-600">
                        У вас пока нет игр
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "feedbacks" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Выберите игру для просмотра фидбеков
                  </h3>
                  <select
                    value={selectedGameId}
                    onChange={(e) => {
                      setSelectedGameId(e.target.value);
                      if (e.target.value) {
                        feedbackStore.fetchGameFeedbacks(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Выберите игру</option>
                    {gameStore.games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.title} (ID: {game.id})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedGameId && <FeedbackList gameId={selectedGameId} />}
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Всего игр
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {gameStore.games.length}
                    </p>
                  </div>
                  {/* <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      В тестировании
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {
                        gameStore.games.filter(
                          (game) => game.status === "в работе"
                        ).length
                      }
                    </p>
                  </div> */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Завершенных
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {
                        gameStore.games.filter(
                          (game) => game.status === "демо завершено"
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Статус игр
                  </h3>
                  <div className="space-y-2">
                    {[
                      "доступна",
                      //   "в работе",
                      "завершена",
                      //   "демо завершено",
                    ].map((status) => {
                      const count = gameStore.games.filter(
                        (game) => game.status === status
                      ).length;
                      return (
                        <div
                          key={status}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize">{status}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
});

export default CompanyDashboard;
