import { useEffect, useState } from "react";
import axios from "axios";
import authStore from "../../components/stores/authStore";
import { observer } from "mobx-react";
import { UploadGameDemo } from "../features/games/UploadGameDemo";
import { GameCard } from "../features/games/GameCard";

const GamesPage = observer(() => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGames = async () => {
    try {
      const response = await axios.get("/api/games", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      console.log("Fetched games:", response.data);
      setGames(response.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Не удалось загрузить игры. Проверьте подключение к серверу.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStore.token) {
      if (!authStore.user) {
        authStore.fetchUserProfile().then(() => {
          fetchGames();
        });
      } else {
        fetchGames();
      }
    } else {
      setError("Необходима авторизация");
      setLoading(false);
    }
  }, [authStore.token]);

  const handleTakeGame = async (gameId) => {
    if (!authStore.token) {
      setError("Необходима авторизация");
      return;
    }
    let role = "UNKNOWN";
    if (authStore.user && authStore.user.role) {
      role = authStore.user.role;
    } else if (authStore.token) {
      try {
        const jwtDecode = require("jwt-decode");
        const decodedToken = jwtDecode(authStore.token);
        role = decodedToken.role || "UNKNOWN";
      } catch (e) {
        console.error("Failed to decode token for role:", e);
      }
    }
    if (role !== "TESTER" && role !== "UNKNOWN") {
      setError("Только тестеры могут взять игру в работу");
      return;
    }
    try {
      const response = await axios.post(
        `/api/games/${gameId}/assign`,
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );
      await fetchGames();
      alert("Игра взята в работу");
    } catch (err) {
      console.error("Assign error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Не удалось взять игру в работу."
      );
      if (err.response) {
        console.log("Server response:", err.response.data);
      }
    }
  };

  const handleGameStatusChange = (gameId, newStatus) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      )
    );
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-600 p-8">{error}</div>;

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
                  <UploadGameDemo onUploadSuccess={fetchGames} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {games.length > 0 ? (
                  games.map((game) => (
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
