import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import feedbackStore from "../../stores/feedbackStore";
import { CreateFeedback } from "./CreateFeedback";

export const FinalFeedback = observer(({ gameId, onSuccess }) => {
  const [hasFinalFeedback, setHasFinalFeedback] = useState(false);
  const [checkingFinal, setCheckingFinal] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли уже финальный фидбек
    if (gameId) {
      checkFinalFeedback();
    }
  }, [gameId]);

  const checkFinalFeedback = async () => {
    setCheckingFinal(true);
    try {
      const result = await feedbackStore.checkHasFinalFeedbackByGame(gameId);
      setHasFinalFeedback(result === true || result?.hasFinal === true);
    } catch (error) {
      console.error('Ошибка при проверке финального фидбека:', error);
    } finally {
      setCheckingFinal(false);
    }
  };

  const handleFinalFeedbackSuccess = () => {
    setHasFinalFeedback(true);
    if (onSuccess) {
      onSuccess();
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
        <p>Вы уже оставили финальный фидбек для данной игры.</p>
      </div>
    );
  }

  return (
    <CreateFeedback 
      gameId={gameId} 
      isFinalFeedback={true}
      onSuccess={handleFinalFeedbackSuccess}
    />
  );
});
