import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import adminStore from "../../stores/adminStore";

const AdminDashboard = observer(() => {
  useEffect(() => {
    adminStore.fetchDashboardStats();
    adminStore.fetchBlockedUsersStats();
  }, []);

  if (adminStore.isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  const stats = adminStore.dashboardStats;
  const blockedUsers = adminStore.blockedUsers;

  const statCards = [
    {
      title: "Всего пользователей",
      value: stats.totalUsers || 0,
      icon: "👥",
      color: "bg-blue-500",
      change: stats.newUsersToday ? `+${stats.newUsersToday} сегодня` : null,
    },
    {
      title: "Активных игр",
      value: stats.totalGames || 0,
      icon: "🎮",
      color: "bg-green-500",
      change: stats.newGamesToday ? `+${stats.newGamesToday} сегодня` : null,
    },
    {
      title: "Активных назначений",
      value: stats.activeAssignments || 0,
      icon: "📋",
      color: "bg-yellow-500",
      change: stats.completedToday
        ? `${stats.completedToday} завершено сегодня`
        : null,
    },
    {
      title: "Всего отзывов",
      value: stats.totalFeedbacks || 0,
      icon: "💬",
      color: "bg-purple-500",
      change: stats.newFeedbacksToday
        ? `+${stats.newFeedbacksToday} сегодня`
        : null,
    },
    {
      title: "Заблокированных пользователей",
      value: stats.blockedUsers || 0,
      icon: "🚫",
      color: "bg-red-500",
      change: stats.blockedToday ? `+${stats.blockedToday} сегодня` : null,
    },
    {
      title: "Компаний",
      value: stats.totalCompanies || 0,
      icon: "🏢",
      color: "bg-indigo-500",
      change: stats.activeCompanies
        ? `${stats.activeCompanies} активных`
        : null,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Обзор системы</h2>
        <p className="text-gray-600">Общая статистика и ключевые показатели</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center">
              <div
                className={`${stat.color} p-3 rounded-lg text-white text-2xl mr-4`}
              >
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                {stat.change && (
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚨 Критические уведомления
          </h3>
          <div className="space-y-3">
            {stats.criticalAlerts && stats.criticalAlerts.length > 0 ? (
              stats.criticalAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-red-50 rounded-lg"
                >
                  <span className="text-red-500 mr-3">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {alert.title}
                    </p>
                    <p className="text-sm text-red-600">{alert.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 mr-3">✅</span>
                <p className="text-sm text-green-800">
                  Критических уведомлений нет
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminDashboard;
