import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import adminStore from "../../stores/adminStore";

const AdminFeedbacks = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    adminStore.fetchFeedbacks();
  }, []);

  const getFilteredAndSortedFeedbacks = () => {
    let filtered = adminStore.feedbacks.filter((feedback) => {
      // Поиск по тексту
      const matchesSearch =
        feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.gameTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.testerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Фильтр по типу
      if (filterType !== "all" && feedback.feedbackType !== filterType)
        return false;

      // Фильтр по рейтингу
      if (filterRating !== "all") {
        const rating = feedback.rating;
        switch (filterRating) {
          case "1-2":
            return rating >= 1 && rating <= 2;
          case "3":
            return rating === 3;
          case "4-5":
            return rating >= 4 && rating <= 5;
          case "no-rating":
            return !rating;
          default:
            return true;
        }
      }

      return true;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortBy === "rating") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "BUG":
        return "bg-red-100 text-red-800";
      case "FINAL":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "BUG":
        return "Баг";
      case "FINAL":
        return "Финальный";
      default:
        return type;
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">Без оценки</span>;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const feedbacks = getFilteredAndSortedFeedbacks();

  if (adminStore.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка отзывов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Управление отзывами
        </h2>
        <p className="text-gray-600">
          Просмотр и анализ всех отзывов в системе
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <input
              type="text"
              placeholder="Поиск по тексту, игре, тестеру..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип отзыва
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все типы</option>
              <option value="BUG">Баги</option>
              <option value="FINAL">Финальные</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Рейтинг
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Все рейтинги</option>
              <option value="1-2">1-2 звезды</option>
              <option value="3">3 звезды</option>
              <option value="4-5">4-5 звезд</option>
              <option value="no-rating">Без оценки</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сортировка
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">По дате</option>
                <option value="rating">По рейтингу</option>
                <option value="gameTitle">По игре</option>
                <option value="type">По типу</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {adminStore.feedbacks.length}
          </div>
          <div className="text-sm text-gray-600">Всего отзывов</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {
              adminStore.feedbacks.filter((f) => f.rating && f.rating >= 4)
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Положительные (4-5★)</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {
              adminStore.feedbacks.filter((f) => f.rating && f.rating <= 2)
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Отрицательные (1-2★)</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {
              adminStore.feedbacks.filter((f) => f.feedbackType === "BUG")
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Сообщения о багах</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отзыв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Игра
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тестер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рейтинг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {feedback.comment || "Без комментария"}
                      </div>
                      {feedback.screenshots &&
                        feedback.screenshots.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            📷 {feedback.screenshots.length} скриншот(ов)
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">🎮</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {feedback.gameTitle || "Неизвестно"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feedback.companyName || "Неизвестная компания"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {feedback.testerName || "Неизвестно"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {feedback.testerEmail || "Email не указан"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        feedback.feedbackType
                      )}`}
                    >
                      {getTypeText(feedback.feedbackTypeDisplayName)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{renderStars(feedback.rating)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(feedback.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {feedbacks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== "all" || filterRating !== "all"
                ? "Отзывы не найдены"
                : "Отзывов нет"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all" || filterRating !== "all"
                ? "Попробуйте изменить критерии поиска или фильтры"
                : "Отзывы появятся здесь после создания тестерами"}
            </p>
          </div>
        )}
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Детали отзыва
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">🎮</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {selectedFeedback.gameName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedFeedback.companyName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Тестер
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedFeedback.testerName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedFeedback.testerEmail}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Дата создания
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDate(selectedFeedback.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Тип отзыва
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                      selectedFeedback.feedbackType
                    )}`}
                  >
                    {getTypeText(selectedFeedback.feedbackType)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Рейтинг
                  </label>
                  <div>{renderStars(selectedFeedback.rating)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Комментарий
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.comment || "Комментарий не указан"}
                  </p>
                </div>
              </div>

              {selectedFeedback.screenshots &&
                selectedFeedback.screenshots.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Скриншоты ({selectedFeedback.screenshots.length})
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedFeedback.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative">
                          <img
                            src={screenshot.url || screenshot}
                            alt={`Скриншот ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          {screenshot.description && (
                            <div className="mt-1 text-xs text-gray-500">
                              {screenshot.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminFeedbacks;
