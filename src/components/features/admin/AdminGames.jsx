import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import adminStore from '../../stores/adminStore';

const AdminGames = observer(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGames, setSelectedGames] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'ACTIVE',
    maxTesters: 10,
    demoActive: true
  });

  useEffect(() => {
    // Загружаем игры при загрузке компонента
    adminStore.fetchGames();
  }, []);

  const handleSelectGame = (gameId) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleSelectAll = () => {
    const games = getFilteredGames();
    if (selectedGames.length === games.length) {
      setSelectedGames([]);
    } else {
      setSelectedGames(games.map(game => game.id));
    }
  };

  const getFilteredGames = () => {
    return adminStore.games.filter(game =>
      game.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await adminStore.deleteGame(gameId);
      setSelectedGames(prev => prev.filter(id => id !== gameId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Ошибка при удалении игры:', error);
    }
  };

  const handleEditGame = (game) => {
    setEditFormData({
      title: game.title || '',
      description: game.description || '',
      status: game.status || 'ACTIVE',
      maxTesters: game.maxTesters || 10,
      demoActive: game.demoActive !== false
    });
    setShowEditModal(game.id);
  };

  const handleSaveEdit = async () => {
    try {
      await adminStore.editGame(showEditModal, editFormData);
      setShowEditModal(null);
    } catch (error) {
      console.error('Ошибка при редактировании игры:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DEMO_FINISHED':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIDDEN':
        return 'bg-gray-100 text-gray-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Активна';
      case 'DEMO_FINISHED':
        return 'Демо завершено';
      case 'HIDDEN':
        return 'Скрыта';
      case 'DELETED':
        return 'Удалена';
      default:
        return status;
    }
  };

  const games = getFilteredGames();

  if (adminStore.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка игр...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Управление играми</h2>
        <p className="text-gray-600">Просмотр, редактирование и удаление игр в системе</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Поиск по названию, описанию или компании..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedGames.length > 0 && (
            <span className="text-sm text-gray-600">
              Выбрано: {selectedGames.length}
            </span>
          )}
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGames.length === games.length && games.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Игра
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Компания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тестеры
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отзывы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game.id)}
                      onChange={() => handleSelectGame(game.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {game.imageUrl ? (
                          <img 
                            src={game.imageUrl} 
                            alt={game.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-lg">🎮</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {game.title || 'Без названия'}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {game.description || 'Без описания'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {game.companyName || 'Неизвестно'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>Активных: {game.activeAssignments || 0}</div>
                      <div>Всего: {game.totalAssignments || 0}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>Всего: {game.totalFeedbacks || 0}</div>
                      <div>Средняя оценка: {game.averageRating ? game.averageRating.toFixed(1) : 'Нет'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {game.createdAt ? new Date(game.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEditGame(game)}
                      disabled={adminStore.isEditingGame}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(game.id)}
                      disabled={adminStore.isDeletingGame}
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

        {games.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">🎮</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Игры не найдены' : 'Игр нет'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Попробуйте изменить критерии поиска'
                : 'Игры появятся здесь после загрузки компаниями'
              }
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Редактирование игры
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Активна</option>
                  <option value="DEMO_FINISHED">Демо завершено</option>
                  <option value="HIDDEN">Скрыта</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Максимум тестеров
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editFormData.maxTesters}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, maxTesters: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="demoActive"
                  checked={editFormData.demoActive}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, demoActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="demoActive" className="ml-2 block text-sm text-gray-700">
                  Демо активно
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={adminStore.isEditingGame}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {adminStore.isEditingGame ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

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
              Вы уверены, что хотите удалить эту игру? Это действие нельзя отменить. Все связанные данные (отзывы, назначения) также будут удалены.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteGame(showDeleteConfirm)}
                disabled={adminStore.isDeletingGame}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {adminStore.isDeletingGame ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminGames;
