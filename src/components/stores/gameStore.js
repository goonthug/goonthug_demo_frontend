import { makeAutoObservable, action, runInAction } from 'mobx';
import axios from 'axios';
import authStore from './authStore';

class GameStore {
  // Состояние данных
  games = [];
  
  // Состояние загрузки
  isLoading = false;
  isFinishingDemo = false;
  isHiding = false;
  
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

  setFinishingDemo = action((finishing) => {
    this.isFinishingDemo = finishing;
  });

  setHiding = action((hiding) => {
    this.isHiding = hiding;
  });

  // Установка ошибки
  setError = action((error) => {
    this.error = error;
  });

  // Загрузить игры
  fetchGames = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get('/api/games', {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.games = response.data;
      });

      console.log('Игры загружены:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке игр:', error);
      this.setError(error.response?.data?.message || 'Ошибка при загрузке игр');
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Завершить демо-период игры
  finishDemo = async (gameId) => {
    this.setFinishingDemo(true);
    this.clearError();

    try {
      const response = await axios.put(`/api/games/${gameId}/finish-demo`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Обновляем игру в списке
        const gameIndex = this.games.findIndex(game => game.id === gameId);
        if (gameIndex !== -1) {
          this.games[gameIndex] = { ...this.games[gameIndex], ...response.data };
        }
      });

      console.log(`Демо-период игры ${gameId} завершен:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при завершении демо-периода игры ${gameId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при завершении демо-периода');
      throw error;
    } finally {
      this.setFinishingDemo(false);
    }
  };

  // Скрыть игру (пока не используется, но готово для будущего)
  hideGame = async (gameId) => {
    this.setHiding(true);
    this.clearError();

    try {
      const response = await axios.put(`/api/games/${gameId}/hide`, {}, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Обновляем игру в списке
        const gameIndex = this.games.findIndex(game => game.id === gameId);
        if (gameIndex !== -1) {
          this.games[gameIndex] = { ...this.games[gameIndex], ...response.data };
        }
      });

      console.log(`Игра ${gameId} скрыта:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при скрытии игры ${gameId}:`, error);
      this.setError(error.response?.data?.message || 'Ошибка при скрытии игры');
      throw error;
    } finally {
      this.setHiding(false);
    }
  };

  // Обновить статус игры локально
  updateGameStatus = action((gameId, newStatus) => {
    const gameIndex = this.games.findIndex(game => game.id === gameId);
    if (gameIndex !== -1) {
      this.games[gameIndex].status = newStatus;
    }
  });

  // Очистка всех данных
  clearAll = action(() => {
    this.games = [];
    this.error = null;
    this.isLoading = false;
    this.isFinishingDemo = false;
    this.isHiding = false;
  });

  // Геттеры
  get hasGames() {
    return this.games.length > 0;
  }

  // Получить игры по статусу
  getGamesByStatus = (status) => {
    return this.games.filter(game => game.status === status);
  };

  // Получить игры текущего пользователя (для компаний)
  get myGames() {
    if (authStore.user?.role === 'COMPANY') {
      return this.games.filter(game => game.companyId === authStore.user.id);
    }
    return this.games;
  }
}

export default new GameStore();
