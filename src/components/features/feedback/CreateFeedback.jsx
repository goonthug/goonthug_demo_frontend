import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import feedbackStore from "../../stores/feedbackStore";

export const CreateFeedback = observer(
  ({ gameId, onSuccess, isFinalFeedback = false }) => {
    const [formData, setFormData] = useState({
      gameId: gameId || 0,
      rating: isFinalFeedback ? 5 : null,
      comment: "",
      feedbackType: isFinalFeedback ? "FINAL" : "BUG"
    });

    useEffect(() => {
      // Устанавливаем gameId если он передан
      if (gameId) {
        setFormData(prev => ({
          ...prev,
          gameId: gameId
        }));
      }
    }, [gameId]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "rating" ? (value ? parseFloat(value) : null) : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Подготавливаем данные для отправки
        const submitData = {
          gameId: formData.gameId,
          comment: formData.comment,
          feedbackType: formData.feedbackType
        };

        // Добавляем рейтинг только для финального фидбека
        if (formData.feedbackType === "FINAL") {
          submitData.rating = formData.rating;
        }

        await feedbackStore.createFeedback(submitData);

        // Очищаем форму после успешного создания
        setFormData({
          gameId: gameId || 0,
          rating: isFinalFeedback ? 5 : null,
          comment: "",
          feedbackType: isFinalFeedback ? "FINAL" : "BUG"
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Ошибка при создании фидбека:", error);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {isFinalFeedback ? "Финальный фидбек" : "Создать фидбек"}
        </h3>

        {feedbackStore.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {feedbackStore.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isFinalFeedback && (
            <div>
              <label
                htmlFor="feedbackType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Тип фидбека
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="BUG">Баг</option>
                <option value="SUGGESTION">Предложение</option>
                <option value="POSITIVE_REVIEW">Положительный отзыв</option>
                <option value="GENERAL">Общий</option>
              </select>
            </div>
          )}

          {formData.feedbackType === "FINAL" && (
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Оценка (1-10) *
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="10"
                step="0.1"
                value={formData.rating || ""}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Подробное описание проблемы или предложения"
            />
          </div>

          <button
            type="submit"
            disabled={feedbackStore.isCreating}
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              feedbackStore.isCreating
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {feedbackStore.isCreating ? "Создание..." : (isFinalFeedback ? "Отправить финальный фидбек" : "Создать фидбек")}
          </button>
        </form>
      </div>
    );
  }
);
