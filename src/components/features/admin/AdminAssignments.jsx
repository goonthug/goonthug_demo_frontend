import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import adminStore from '../../stores/adminStore';

const AdminAssignments = observer(() => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (activeTab === 'all') {
      adminStore.fetchAssignments();
    } else if (activeTab === 'active') {
      adminStore.fetchActiveAssignments();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAssignments([]);
    setSearchTerm('');
  };

  const handleSelectAssignment = (assignmentId) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId) 
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    const assignments = getCurrentAssignments();
    if (selectedAssignments.length === assignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(assignments.map(assignment => assignment.id));
    }
  };

  const getCurrentAssignments = () => {
    const assignments = activeTab === 'active' ? adminStore.activeAssignments : adminStore.assignments;
    return assignments.filter(assignment => 
      assignment.gameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.testerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCancelAssignment = async (assignmentId) => {
    try {
      await adminStore.cancelAssignment(assignmentId);
      setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
      setShowCancelConfirm(null);
    } catch (error) {
      console.error('Ошибка при отмене назначения:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await adminStore.deleteAssignment(assignmentId);
      setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Ошибка при удалении назначения:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает';
      case 'IN_PROGRESS':
        return 'В процессе';
      case 'COMPLETED':
        return 'Завершено';
      case 'CANCELLED':
        return 'Отменено';
      case 'EXPIRED':
        return 'Истекло';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'Высокий';
      case 'MEDIUM':
        return 'Средний';
      case 'LOW':
        return 'Низкий';
      default:
        return priority || 'Не указан';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const assignments = getCurrentAssignments();

  if (adminStore.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка назначений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Управление назначениями</h2>
        <p className="text-gray-600">Просмотр, отмена и удаление назначений тестирования</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Все назначения ({adminStore.assignments.length})
        </button>
        <button
          onClick={() => handleTabChange('active')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Активные ({adminStore.activeAssignments.length})
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Поиск по игре, тестеру или компании..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedAssignments.length > 0 && (
            <span className="text-sm text-gray-600">
              Выбрано: {selectedAssignments.length}
            </span>
          )}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAssignments.length === assignments.length && assignments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Игра
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тестер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Компания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прогресс
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAssignments.includes(assignment.id)}
                      onChange={() => handleSelectAssignment(assignment.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {assignment.gameImageUrl ? (
                          <img 
                            src={assignment.gameImageUrl} 
                            alt={assignment.gameName}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">🎮</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.gameName || 'Без названия'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {assignment.gameId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.testerName || 'Неизвестно'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.testerEmail || 'Email не указан'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {assignment.companyName || 'Неизвестно'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {getStatusText(assignment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>Отзывов: {assignment.feedbacksCount || 0}</div>
                      {assignment.progress !== undefined && (
                        <div>Прогресс: {assignment.progress}%</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    {assignment.status === 'PENDING' || assignment.status === 'IN_PROGRESS' ? (
                      <button
                        onClick={() => setShowCancelConfirm(assignment.id)}
                        disabled={adminStore.isCancelingAssignment}
                        className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                      >
                        Отменить
                      </button>
                    ) : null}
                    <button
                      onClick={() => setShowDeleteConfirm(assignment.id)}
                      disabled={adminStore.isDeletingAssignment}
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

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Назначения не найдены' : 'Назначений нет'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Попробуйте изменить критерии поиска'
                : 'Назначения появятся здесь после создания'
              }
            </p>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Подтверждение отмены
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Вы уверены, что хотите отменить это назначение? Тестер больше не сможет работать с этой игрой.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отменить действие
              </button>
              <button
                onClick={() => handleCancelAssignment(showCancelConfirm)}
                disabled={adminStore.isCancelingAssignment}
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                {adminStore.isCancelingAssignment ? 'Отмена...' : 'Отменить назначение'}
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
              Вы уверены, что хотите удалить это назначение? Это действие нельзя отменить. Все связанные данные также будут удалены.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteAssignment(showDeleteConfirm)}
                disabled={adminStore.isDeletingAssignment}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {adminStore.isDeletingAssignment ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminAssignments;
