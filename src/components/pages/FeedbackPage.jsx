import { useState } from "react";
import { observer } from "mobx-react";
import { CreateFeedback, FeedbackList } from "../features/feedback";
import authStore from "../stores/authStore";

const FeedbackPage = observer(() => {
  const [activeTab, setActiveTab] = useState("my");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [gameId, setGameId] = useState("");

  if (!authStore.token) {
    return (
      <div className="bg-[#F9F9F9] min-h-screen">
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-black mb-6">Фидбеки</h1>
              <p className="text-red-600 bg-red-100 p-4 rounded-md shadow-md">
                Пожалуйста, авторизуйтесь для доступа к фидбекам.
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
          <h1 className="text-4xl font-bold text-black mb-6">Фидбеки</h1>

          {/* Табы */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("my")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "my"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Мои фидбеки
                </button>

                {authStore.user?.role === "COMPANY" && (
                  <button
                    onClick={() => setActiveTab("game")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "game"
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Фидбеки по игре
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Контент табов */}
          <div className="space-y-6">
            {activeTab === "my" && <FeedbackList showMyFeedbacks={true} />}

            {activeTab === "game" && authStore.user?.role === "COMPANY" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Выберите игру для просмотра фидбеков
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="ID игры"
                      value={selectedGameId}
                      onChange={(e) => setSelectedGameId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => setSelectedGameId(selectedGameId)}
                      disabled={!selectedGameId.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Загрузить фидбеки
                    </button>
                  </div>
                </div>

                {selectedGameId && <FeedbackList gameId={selectedGameId} />}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
});

export default FeedbackPage;
