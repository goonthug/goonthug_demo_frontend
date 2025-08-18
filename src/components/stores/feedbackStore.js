import { makeAutoObservable, action, runInAction } from 'mobx';
import axios from 'axios';
import authStore from './authStore';

class FeedbackStore {
  // Состояние данных
  feedbacks = [];
  myFeedbacks = [];
  feedbackTypes = [];
  
  // Состояние загрузки
  isLoading = false;
  isCreating = false;
  isCompleting = false;
  
  // Ошибки
  error = null;
  
  constructor() {
    makeAutoObservable(this);
  }

  // Очистка ошибок
  clearError = action(() => {
    this.error = null;
  });

  // Установка состояния загрузки
  setLoading = action((loading) => {
    this.isLoading = loading;
  });

  setCreating = action((creating) => {
    this.isCreating = creating;
  });

  setCompleting = action((completing) => {
    this.isCompleting = completing;
  });

  // Установка ошибки
  setError = action((error) => {
    this.error = error;
  });

  // Создать фидбек
  createFeedback = async (feedbackData) => {
    this.setCreating(true);
    this.clearError();

    try {
      const response = await axios.post('/api/feedback/create', feedbackData, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Добавляем новый фидбек в список
        this.feedbacks.push(response.data);
        this.myFeedbacks.push(response.data);
      });

      console.log('Фидбек успешно создан:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании фидбека:', error);
      this.setError(error.response?.data?.message || 'Ошибка при создании фидбека');
      throw error;
    } finally {
      this.setCreating(false);
    }
  };

  // Завершить тестирование с финальным фидбеком
  completeTest = async (completionData) => {
    this.setCompleting(true);
    this.clearError();

    try {
      const response = await axios.post('/api/feedback/complete-test', completionData, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Обновляем фидбеки после завершения тестирования
        if (response.data) {
          this.feedbacks.push(response.data);
          this.myFeedbacks.push(response.data);
        }
      });

      console.log('Тестирование успешно завершено:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при завершении тестирования:', error);
      this.setError(error.response?.data?.message || 'Ошибка при завершении тестирования');
      throw error;
    } finally {
      this.setCompleting(false);
    }
  };

  // Получить типы фидбеков
  fetchFeedbackTypes = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get('/api/feedback/types', {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.feedbackTypes = response.data;
      });

      console.log('Типы фидбеков загружены:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке типов фидбеков:', error);
      this.setError(error.response?.data?.message || 'Ошибка при загрузке типов фидбеков');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить мои фидбеки
  fetchMyFeedbacks = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get('/api/feedback/my', {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.myFeedbacks = response.data;
      });

      console.log('Мои фидбеки загружены:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке моих фидбеков:', error);
      this.setError(error.response?.data?.message || 'Ошибка при загрузке моих фидбеков');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить все фидбеки для игры
  fetchGameFeedbacks = async (gameId) => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get(`/api/feedback/game/${gameId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.feedbacks = response.data;
      });

      console.log(`Фидбеки для игры ${gameId} загружены:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке фидбеков для игры ${gameId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при загрузке фидбеков для игры');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить фидбеки для назначения
  fetchAssignmentFeedbacks = async (assignmentId) => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get(`/api/feedback/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.feedbacks = response.data;
      });

      console.log(`Фидбеки для назначения ${assignmentId} загружены:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при загрузке фидбеков для назначения ${assignmentId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при загрузке фидбеков для назначения');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Проверить наличие финального фидбека по assignmentId (старый метод)
  checkHasFinalFeedback = async (assignmentId) => {
    this.clearError();

    try {
      const response = await axios.get(`/api/feedback/assignment/${assignmentId}/has-final`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      console.log(`Проверка финального фидбека для назначения ${assignmentId}:`, response.data);
      return response.data; // Ожидаем boolean или объект с информацией
    } catch (error) {
      console.error(`Ошибка при проверке финального фидбека для назначения ${assignmentId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при проверке финального фидбека');
      throw error;
    }
  };

  // Проверить наличие финального фидбека по gameId (новый метод)
  checkHasFinalFeedbackByGame = async (gameId) => {
    this.clearError();

    try {
      const response = await axios.get(`/api/feedback/game/${gameId}/has-final`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      console.log(`Проверка финального фидбека для игры ${gameId}:`, response.data);
      return response.data; // Ожидаем boolean или объект с информацией
    } catch (error) {
      console.error(`Ошибка при проверке финального фидбека для игры ${gameId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при проверке финального фидбека');
      throw error;
    }
  };

  // Очистка всех данных (полезно при логауте)
  clearAll = action(() => {
    this.feedbacks = [];
    this.myFeedbacks = [];
    this.feedbackTypes = [];
    this.error = null;
    this.isLoading = false;
    this.isCreating = false;
    this.isCompleting = false;
  });

  // Вспомогательные геттеры
  get hasFeedbacks() {
    return this.feedbacks.length > 0;
  }

  get hasMyFeedbacks() {
    return this.myFeedbacks.length > 0;
  }

  get hasFeedbackTypes() {
    return this.feedbackTypes.length > 0;
  }

  // Получить фидбеки по типу
  getFeedbacksByType = (type) => {
    return this.feedbacks.filter(feedback => feedback.type === type);
  };

  // Получить последний фидбек
  get lastFeedback() {
    return this.feedbacks.length > 0 ? this.feedbacks[this.feedbacks.length - 1] : null;
  }
}

export default new FeedbackStore();