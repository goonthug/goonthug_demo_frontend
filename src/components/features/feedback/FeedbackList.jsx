import { useEffect } from "react";
import { observer } from "mobx-react";
import feedbackStore from "../../stores/feedbackStore";

export const FeedbackList = observer(
  ({ gameId, assignmentId, showMyFeedbacks = false }) => {
    useEffect(() => {
      if (showMyFeedbacks) {
        feedbackStore.fetchMyFeedbacks();
      } else if (gameId) {
        feedbackStore.fetchGameFeedbacks(gameId);
      } else if (assignmentId) {
        feedbackStore.fetchAssignmentFeedbacks(assignmentId);
      }
    }, [gameId, assignmentId, showMyFeedbacks]);

    const feedbacks = showMyFeedbacks
      ? feedbackStore.myFeedbacks
      : feedbackStore.feedbacks;

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("ru-RU");
    };

    if (feedbackStore.isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Загрузка фидбеков...</div>
        </div>
      );
    }

    if (feedbackStore.error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Ошибка: {feedbackStore.error}
        </div>
      );
    }

    if (!feedbacks.length) {
      return (
        <div className="text-center py-8 text-gray-600">
          {showMyFeedbacks ? "У вас пока нет фидбеков" : "Фидбеки не найдены"}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {showMyFeedbacks ? "Мои фидбеки" : "Фидбеки"}
        </h3>

        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-gray-800">
                {feedback.gameTitle || "Без названия"}
              </h4>
              {feedback.rating && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500 text-white">
                  {feedback.rating}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Тип: {feedback.feedbackTypeDisplayName}
              </span>
            </div>

            <p className="text-gray-700 mb-4 whitespace-pre-wrap">
              {feedback.comment}
            </p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Автор: {feedback.testerEmail || "Неизвестен"}</span>
              {feedback.createdAt && (
                <span>Создано: {formatDate(feedback.createdAt)}</span>
              )}
            </div>

            {feedback.updatedAt &&
              feedback.updatedAt !== feedback.createdAt && (
                <div className="text-xs text-gray-400 mt-2">
                  Обновлено: {formatDate(feedback.updatedAt)}
                </div>
              )}
          </div>
        ))}
      </div>
    );
  }
);
