import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import adminStore from "../../stores/adminStore";

const AdminUsers = observer(() => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    // Загружаем пользователей при загрузке компонента
    if (activeTab === "all") {
      adminStore.fetchUsers();
    } else if (activeTab === "blocked") {
      adminStore.fetchBlockedUsers();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUsers([]);
    setSearchTerm("");
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const users = getCurrentUsers();
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const getCurrentUsers = () => {
    const users =
      activeTab === "blocked" ? adminStore.blockedUsers : adminStore.users;
    return users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleBlockUser = async (userId) => {
    try {
      await adminStore.blockUser(userId);
    } catch (error) {
      console.error("Ошибка при блокировке пользователя:", error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await adminStore.unblockUser(userId);
    } catch (error) {
      console.error("Ошибка при разблокировке пользователя:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminStore.deleteUser(userId);
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "COMPANY":
        return "bg-blue-100 text-blue-800";
      case "TESTER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (blocked) => {
    return blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  };

  const users = getCurrentUsers();

  if (adminStore.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Управление пользователями
        </h2>
        <p className="text-gray-600">
          Просмотр, блокировка и управление пользователями системы
        </p>
      </div>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Все пользователи ({adminStore.users.length})
        </button>
        <button
          onClick={() => handleTabChange("blocked")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "blocked"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Заблокированные ({adminStore.blockedUsers.length})
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedUsers.length > 0 && (
            <span className="text-sm text-gray-600">
              Выбрано: {selectedUsers.length}
            </span>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статистика
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName?.charAt(0) ||
                              user.companyName?.charAt(0) ||
                              "?"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.companyName ||
                            user.firstName + " " + user.lastName ||
                            "Без имени"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        user.blocked
                      )}`}
                    >
                      {user.blocked ? "Заблокирован" : "Активен"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {user.gamesCount !== undefined && (
                        <div>Игр: {user.gamesCount || 0}</div>
                      )}
                      {user.totalFeedbacks !== undefined && (
                        <div>Отзывов: {user.totalFeedbacks || 0}</div>
                      )}
                      {user.totalAssignments !== undefined && (
                        <div>Назначений: {user.totalAssignments || 0}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {user.blocked ? (
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        disabled={adminStore.isUnblockingUser}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        Разблокировать
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        disabled={adminStore.isBlockingUser}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Заблокировать
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(user.id)}
                      disabled={adminStore.isDeletingUser}
                      className="ml-2 text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Пользователи не найдены" : "Пользователей нет"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Попробуйте изменить критерии поиска"
                : "Пользователи появятся здесь после регистрации"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Подтверждение удаления
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Вы уверены, что хотите удалить этого пользователя? Это действие
              нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                disabled={adminStore.isDeletingUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {adminStore.isDeletingUser ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminUsers;
