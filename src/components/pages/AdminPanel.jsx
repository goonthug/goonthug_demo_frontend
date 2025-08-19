import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";
import adminStore from "../stores/adminStore";
import AdminUsers from "../features/admin/AdminUsers";
import AdminGames from "../features/admin/AdminGames";
import AdminFeedbacks from "../features/admin/AdminFeedbacks";
import AdminAssignments from "../features/admin/AdminAssignments";
import AdminDashboard from "../features/admin/AdminDashboard";

const AdminPanel = observer(() => {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Проверяем, что пользователь администратор
    if (!authStore.user || authStore.user.role !== "ADMIN") {
      return;
    }

    // Загружаем основную статистику при загрузке
    adminStore.fetchDashboardStats();
  }, []);

  // Если пользователь не администратор
  if (!authStore.user || authStore.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Доступ запрещен
          </h1>
          <p className="text-gray-600">
            У вас нет прав для доступа к административной панели.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Дашборд", icon: "📊" },
    { id: "users", label: "Пользователи", icon: "👥" },
    { id: "games", label: "Игры", icon: "🎮" },
    { id: "assignments", label: "Назначения", icon: "📋" },
    { id: "feedbacks", label: "Отзывы", icon: "💬" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "games":
        return <AdminGames />;
      case "assignments":
        return <AdminAssignments />;
      case "feedbacks":
        return <AdminFeedbacks />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🛠️ Административная панель
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Добро пожаловать, {authStore.user.name}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminStore.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Произошла ошибка
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {adminStore.error}
                </div>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={adminStore.clearError}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">{renderTabContent()}</div>
      </div>
    </div>
  );
});

export default AdminPanel;
