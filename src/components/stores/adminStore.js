import { makeAutoObservable, action, runInAction } from "mobx";
import axios from "axios";
import authStore from "./authStore";

class AdminStore {
  // Состояние данных
  users = [];
  blockedUsers = [];
  games = [];
  feedbacks = [];
  assignments = [];
  activeAssignments = [];
  dashboardStats = {};

  // Состояние загрузки
  isLoading = false;
  isBlockingUser = false;
  isUnblockingUser = false;
  isDeletingUser = false;
  isDeletingGame = false;
  isEditingGame = false;
  isCancelingAssignment = false;
  isDeletingAssignment = false;

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

  setBlockingUser = action((blocking) => {
    this.isBlockingUser = blocking;
  });

  setUnblockingUser = action((unblocking) => {
    this.isUnblockingUser = unblocking;
  });

  setDeletingUser = action((deleting) => {
    this.isDeletingUser = deleting;
  });

  setDeletingGame = action((deleting) => {
    this.isDeletingGame = deleting;
  });

  setEditingGame = action((editing) => {
    this.isEditingGame = editing;
  });

  setCancelingAssignment = action((canceling) => {
    this.isCancelingAssignment = canceling;
  });

  setDeletingAssignment = action((deleting) => {
    this.isDeletingAssignment = deleting;
  });

  // Установка ошибки
  setError = action((error) => {
    this.error = error;
  });

  // Получить всех пользователей
  fetchUsers = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.users = response.data;
      });

      console.log("Пользователи загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      this.setError(
        error.response?.data?.message || "Ошибка при загрузке пользователей"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить заблокированных пользователей
  fetchBlockedUsers = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/users/blocked", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.blockedUsers = response.data;
        this.dashboardStats.blockedUsers = response.data;
      });

      console.log("Заблокированные пользователи загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Ошибка при загрузке заблокированных пользователей:",
        error
      );
      this.setError(
        error.response?.data?.message ||
          "Ошибка при загрузке заблокированных пользователей"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Заблокировать пользователя
  blockUser = async (userId) => {
    this.setBlockingUser(true);
    this.clearError();

    try {
      const response = await axios.post(
        `/api/admin/users/${userId}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      runInAction(() => {
        // Обновляем пользователя в списке
        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], blocked: true };
        }
      });

      console.log(`Пользователь ${userId} заблокирован:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при блокировке пользователя ${userId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при блокировке пользователя"
      );
      throw error;
    } finally {
      this.setBlockingUser(false);
    }
  };

  // Разблокировать пользователя
  unblockUser = async (userId) => {
    this.setUnblockingUser(true);
    this.clearError();

    try {
      const response = await axios.post(
        `/api/admin/users/${userId}/unblock`,
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      runInAction(() => {
        // Обновляем пользователя в списке
        const userIndex = this.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], blocked: false };
        }
        // Удаляем из списка заблокированных
        this.blockedUsers = this.blockedUsers.filter(
          (user) => user.id !== userId
        );
      });

      console.log(`Пользователь ${userId} разблокирован:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при разблокировке пользователя ${userId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при разблокировке пользователя"
      );
      throw error;
    } finally {
      this.setUnblockingUser(false);
    }
  };

  // Удалить пользователя
  deleteUser = async (userId) => {
    this.setDeletingUser(true);
    this.clearError();

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Удаляем пользователя из списков
        this.users = this.users.filter((user) => user.id !== userId);
        this.blockedUsers = this.blockedUsers.filter(
          (user) => user.id !== userId
        );
      });

      console.log(`Пользователь ${userId} удален`);
    } catch (error) {
      console.error(`Ошибка при удалении пользователя ${userId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при удалении пользователя"
      );
      throw error;
    } finally {
      this.setDeletingUser(false);
    }
  };

  // Получить все игры
  fetchGames = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/games", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.games = response.data;
      });

      console.log("Игры загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке игр:", error);
      this.setError(error.response?.data?.message || "Ошибка при загрузке игр");
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Редактировать игру
  editGame = async (gameId, gameData) => {
    this.setEditingGame(true);
    this.clearError();

    try {
      const response = await axios.put(`/api/admin/games/${gameId}`, gameData, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Обновляем игру в списке
        const gameIndex = this.games.findIndex((game) => game.id === gameId);
        if (gameIndex !== -1) {
          this.games[gameIndex] = {
            ...this.games[gameIndex],
            ...response.data,
          };
        }
      });

      console.log(`Игра ${gameId} отредактирована:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при редактировании игры ${gameId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при редактировании игры"
      );
      throw error;
    } finally {
      this.setEditingGame(false);
    }
  };

  // Удалить игру
  deleteGame = async (gameId) => {
    this.setDeletingGame(true);
    this.clearError();

    try {
      await axios.delete(`/api/admin/games/${gameId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Удаляем игру из списка
        this.games = this.games.filter((game) => game.id !== gameId);
      });

      console.log(`Игра ${gameId} удалена`);
    } catch (error) {
      console.error(`Ошибка при удалении игры ${gameId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при удалении игры"
      );
      throw error;
    } finally {
      this.setDeletingGame(false);
    }
  };

  // Получить все фидбеки
  fetchFeedbacks = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/feedbacks", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.feedbacks = response.data;
      });

      console.log("Фидбеки загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке фидбеков:", error);
      this.setError(
        error.response?.data?.message || "Ошибка при загрузке фидбеков"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить все назначения
  fetchAssignments = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/assignments", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.assignments = response.data;
      });

      console.log("Назначения загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке назначений:", error);
      this.setError(
        error.response?.data?.message || "Ошибка при загрузке назначений"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить активные назначения
  fetchActiveAssignments = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/assignments/active", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.activeAssignments = response.data;
      });

      console.log("Активные назначения загружены:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке активных назначений:", error);
      this.setError(
        error.response?.data?.message ||
          "Ошибка при загрузке активных назначений"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Создать назначение
  createAssignment = async (assignmentData) => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.post(
        "/api/admin/assignments",
        assignmentData,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      runInAction(() => {
        // Добавляем новое назначение в список
        this.assignments.push(response.data);
        if (
          response.data.status === "PENDING" ||
          response.data.status === "IN_PROGRESS"
        ) {
          this.activeAssignments.push(response.data);
        }
      });

      console.log("Назначение создано:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании назначения:", error);
      this.setError(
        error.response?.data?.message || "Ошибка при создании назначения"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Создать множественные назначения
  createAssignments = async (assignmentsData) => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.post(
        "/api/admin/assignments/bulk",
        { assignments: assignmentsData },
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      runInAction(() => {
        // Добавляем новые назначения в список
        this.assignments.push(...response.data);
        response.data.forEach((assignment) => {
          if (
            assignment.status === "PENDING" ||
            assignment.status === "IN_PROGRESS"
          ) {
            this.activeAssignments.push(assignment);
          }
        });
      });

      console.log("Назначения созданы:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при создании назначений:", error);
      this.setError(
        error.response?.data?.message || "Ошибка при создании назначений"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Отменить назначение
  cancelAssignment = async (assignmentId) => {
    this.setCancelingAssignment(true);
    this.clearError();

    try {
      const response = await axios.post(
        `/api/admin/assignments/${assignmentId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      runInAction(() => {
        // Обновляем назначение в списке
        const assignmentIndex = this.assignments.findIndex(
          (assignment) => assignment.id === assignmentId
        );
        if (assignmentIndex !== -1) {
          this.assignments[assignmentIndex] = {
            ...this.assignments[assignmentIndex],
            status: "cancelled",
          };
        }
        // Удаляем из активных назначений
        this.activeAssignments = this.activeAssignments.filter(
          (assignment) => assignment.id !== assignmentId
        );
      });

      console.log(`Назначение ${assignmentId} отменено:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при отмене назначения ${assignmentId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при отмене назначения"
      );
      throw error;
    } finally {
      this.setCancelingAssignment(false);
    }
  };

  // Удалить назначение
  deleteAssignment = async (assignmentId) => {
    this.setDeletingAssignment(true);
    this.clearError();

    try {
      await axios.delete(`/api/admin/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        // Удаляем назначение из списков
        this.assignments = this.assignments.filter(
          (assignment) => assignment.id !== assignmentId
        );
        this.activeAssignments = this.activeAssignments.filter(
          (assignment) => assignment.id !== assignmentId
        );
      });

      console.log(`Назначение ${assignmentId} удалено`);
    } catch (error) {
      console.error(`Ошибка при удалении назначения ${assignmentId}:`, error);
      this.setError(
        error.response?.data?.message || "Ошибка при удалении назначения"
      );
      throw error;
    } finally {
      this.setDeletingAssignment(false);
    }
  };

  // Получить статистику дашборда
  fetchDashboardStats = async () => {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      runInAction(() => {
        this.dashboardStats = response.data;
      });

      console.log("Статистика дашборда загружена:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке статистики дашборда:", error);
      this.setError(
        error.response?.data?.message ||
          "Ошибка при загрузке статистики дашборда"
      );
      throw error;
    } finally {
      this.setLoading(false);
    }
  };

  // Получить количество заблокированных пользователей
  fetchBlockedUsersStats = async () => {
    this.clearError();

    try {
      const response = await axios.get("/api/admin/stats/blocked-users", {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      console.log("Статистика заблокированных пользователей:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Ошибка при загрузке статистики заблокированных пользователей:",
        error
      );
      this.setError(
        error.response?.data?.message || "Ошибка при загрузке статистики"
      );
      throw error;
    }
  };

  // Очистка всех данных
  clearAll = action(() => {
    this.users = [];
    this.blockedUsers = [];
    this.games = [];
    this.feedbacks = [];
    this.assignments = [];
    this.activeAssignments = [];
    this.dashboardStats = {};
    this.error = null;
    this.isLoading = false;
    this.isBlockingUser = false;
    this.isUnblockingUser = false;
    this.isDeletingUser = false;
    this.isDeletingGame = false;
    this.isEditingGame = false;
    this.isCancelingAssignment = false;
    this.isDeletingAssignment = false;
  });

  // Геттеры
  get hasUsers() {
    return this.users.length > 0;
  }

  get hasGames() {
    return this.games.length > 0;
  }

  get hasFeedbacks() {
    return this.feedbacks.length > 0;
  }

  get hasAssignments() {
    return this.assignments.length > 0;
  }
}

export default new AdminStore();
