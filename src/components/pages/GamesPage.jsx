import { useEffect } from "react";
import authStore from "../../components/stores/authStore";
import gameStore from "../../components/stores/gameStore";
import { observer } from "mobx-react";
import { UploadGameDemo } from "../features/games/UploadGameDemo";
import { GameCard } from "../features/games/GameCard";

const GamesPage = observer(() => {
  useEffect(() => {
    if (authStore.token) {
      if (!authStore.user) {
        authStore.fetchUserProfile().then(() => {
          gameStore.fetchGames();
        });
      } else {
        gameStore.fetchGames();
      }
    }
  }, [authStore.token]);

  const handleGameStatusChange = (gameId, newStatus) => {
    gameStore.updateGameStatus(gameId, newStatus);
  };

  if (gameStore.isLoading) return <div>Загрузка...</div>;
  if (gameStore.error) return <div className="text-red-600 p-8">{gameStore.error}</div>;

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-black mb-6">Игры</h1>
          {!authStore.token && (
            <p className="text-white bg-red-600 p-4 rounded-md shadow-md mb-8">
              Пожалуйста, авторизуйтесь для доступа к играм.
            </p>
          )}
          {authStore.token && (
            <div>
              {(authStore.user?.role === "COMPANY" ||
                authStore.user?.role === "UNKNOWN") && (
                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-3xl font-bold text-[#333333] mb-6">
                    Загрузить новую игру
                  </h3>
                  <UploadGameDemo onUploadSuccess={() => gameStore.fetchGames()} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {gameStore.games.length > 0 ? (
                  gameStore.games.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onGameStatusChange={handleGameStatusChange}
                    />
                  ))
                ) : (
                  <p className="text-gray-600 mt-4">Нет доступных игр</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
});

export default GamesPage;
