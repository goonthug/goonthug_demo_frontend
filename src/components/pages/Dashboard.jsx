import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/authStore';
import React from 'react';

export const Dashboard = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    authStore.fetchUserData();
  }, []);

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  return (
    <div className="bg-[#F5F5F0] min-h-screen flex flex-col">
      {/* Заголовок */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-black"></span>
            <span className="text-xl font-bold text-black">Game Tester</span>
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-black">Профиль</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Боковая панель */}
        <aside className="bg-white w-64 shadow-md">
          <nav className="mt-8">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-black font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Профиль
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors"
                >
                  Игры
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors"
                >
                  Настройки
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors"
                >
                  Помощь
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* основной контент */}
        <main className="flex-1 p-8">
          <div className="container mx-auto">
        {/* Раздел информации о пользователе */}
            <section className="flex items-center mb-8">
              <img
                src="https://via.placeholder.com/50" // Замените на реальный путь к изображению профиля
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-black">????????</h2>
                <p className="text-gray-600">Tester | Зарегистрировался 2 месяца назад</p>
              </div>
            </section>
            {/* Stats Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-black mb-4">Ваша статистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h4 className="text-lg font-bold text-black">Протестированные игры</h4>
                  <p className="text-2xl text-red-600">12</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h4 className="text-lg font-bold text-black">Сыгранные часы</h4>
                  <p className="text-2xl text-red-600">45</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h4 className="text-lg font-bold text-black">Сообщалось об ошибках</h4>
                  <p className="text-2xl text-red-600">8</p>
                </div>
              </div>
            </section>

            {/* Available Games Section */}
            <section>
              <h3 className="text-xl font-bold text-black mb-4">Доступные игры для тестирования</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-black">Game Title 1</h4>
                    <p className="text-gray-600">Action-packed adventure</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Start Testing
                  </button>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-black">Game Title 2</h4>
                    <p className="text-gray-600">Strategy puzzle game</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Start Testing
                  </button>
                </div>
              </div>
            </section >

            {/* Ratings Section */}
            <section className='pt-6'>
              <h3 className="text-xl font-bold text-black mb-4">Рейтинг</h3>
              <div className="bg-white p-4 rounded-md shadow-md flex items-center">
                <div className="mr-8">
                  <p className="text-3xl font-bold text-red-600">4.8</p>
                  <div className="flex">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-gray-300">☆</span>
                  </div>
                  <p className="text-gray-600">15 оценок</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="w-8 text-right mr-2">5</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="w-12 ml-2">70%</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="w-8 text-right mr-2">4</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="w-12 ml-2">20%</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="w-8 text-right mr-2">3</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                    <span className="w-12 ml-2">5%</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="w-8 text-right mr-2">2</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                    <span className="w-12 ml-2">3%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-right mr-2">1</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <span className="w-12 ml-2">2%</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
});
