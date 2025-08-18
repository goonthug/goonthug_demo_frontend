import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import feedbackStore from "../../stores/feedbackStore";

export const CompleteTest = observer(({ assignmentId, gameId, onSuccess }) => {
  const [formData, setFormData] = useState({
    assignmentId: assignmentId || "",
    gameId: gameId || "",
    finalFeedback: "",
    rating: 5,
    recommendation: "APPROVE"
  });
  
  const [hasFinalFeedback, setHasFinalFeedback] = useState(false);
  const [checkingFinal, setCheckingFinal] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли уже финальный фидбек
    if (assignmentId) {
      checkFinalFeedback();
    }
  }, [assignmentId]);

  const checkFinalFeedback = async () => {
    setCheckingFinal(true);
    try {
      const result = await feedbackStore.checkHasFinalFeedback(assignmentId);
      setHasFinalFeedback(result === true || result?.hasFinal === true);
    } catch (error) {
      console.error('Ошибка при проверке финального фидбека:', error);
    } finally {
      setCheckingFinal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await feedbackStore.completeTest(formData);
      
      // Очищаем форму после успешного завершения
      setFormData({
        assignmentId: assignmentId || "",
        gameId: gameId || "",
        finalFeedback: "",
        rating: 5,
        recommendation: "APPROVE"
      });

      setHasFinalFeedback(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Ошибка при завершении тестирования:', error);
    }
  };

  if (checkingFinal) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-600">Проверка статуса тестирования...</div>
      </div>
    );
  }

  if (hasFinalFeedback) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <h3 className="font-medium">Тестирование завершено</h3>
        <p>Вы уже завершили тестирование данной игры.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Завершить тестирование</h3>
      
      {feedbackStore.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {feedbackStore.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Оценка игры (1-10)
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="10"
            value={formData.rating}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 mb-1">
            Рекомендация
          </label>
          <select
            id="recommendation"
            name="recommendation"
            value={formData.recommendation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="APPROVE">Одобрить</option>
            <option value="REJECT">Отклонить</option>
            <option value="NEEDS_IMPROVEMENT">Требует доработки</option>
          </select>
        </div>

        <div>
          <label htmlFor="finalFeedback" className="block text-sm font-medium text-gray-700 mb-1">
            Финальный отзыв
          </label>
          <textarea
            id="finalFeedback"
            name="finalFeedback"
            value={formData.finalFeedback}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Напишите подробный отзыв о игре, включая найденные проблемы, положительные моменты и рекомендации"
          />
        </div>

        <button
          type="submit"
          disabled={feedbackStore.isCompleting}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            feedbackStore.isCompleting
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {feedbackStore.isCompleting ? "Завершение..." : "Завершить тестирование"}
        </button>
      </form>
    </div>
  );
});
