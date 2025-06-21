import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Раздел о героях */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <img
            src="/images/1.webp"
            alt="Game Controller"
            className="w-1/2 mx-auto mb-8 shadow-md"
          />
          <h1 className="text-4xl font-bold text-black mb-4">Тестируйте Игры, Получайте Деньги</h1>
          <p className="text-lg text-black mb-8">
            Присоединяйтесь к нашему сообществу тестировщиков игр и <br />получайте награды за игру и отзывы о новейших играх
          </p>
          <div className="flex flex-col items-center space-y-4">
            <button className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
              Станьте тестировщиком
            </button>
            <button className="bg-white border border-gray-300 text-red-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
              Для компаний
            </button>
          </div>
        </div>
      </section>

      {/* Раздел избранных игр */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#333333] mb-8">Рекомендуемые игры</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/images/игра1.jpg" alt="Game 1" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-black">Jumanji</h3>
                <p className="text-gray-600">Остросюжетная приключенческая игра</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/images/игра2.jpg" alt="Game 2" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-black">Космическая база</h3>
                <p className="text-gray-600">Стратегическая игра с головоломками</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/images/игра3.jpg" alt="Game 3" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-black">The Quest Redshift</h3>
                <p className="text-gray-600">Ролевая игра с квестами</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Раздел лучших тестировщиков */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#333333] mb-8">Лучшие Тестировщики
</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-[#FFDAB9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <img src="images/тестер1.jpg" alt="Tester 1" className="w-20 h-20 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-black">Никита М.</h3>
              <p className="text-gray-600">Опытный тестировщик с более чем 50 протестированными играми</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-[#FFDAB9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <img src="images/тестер2.jpg" alt="Tester 2" className="w-20 h-20 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-black">Андрей С.</h3>
              <p className="text-gray-600">Лучший тестировщик стратегических игр</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-[#FFDAB9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <img src="images/тестер3.jpeg" alt="Tester 3" className="w-20 h-20 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-black">Анна Л.</h3>
              <p className="text-gray-600">Новый тестировщик со страстью к РПГ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Раздел CTA */}
      <section className="py-20 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-black mb-4">Готовы начать?</h2>
          <button className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
            Давайте начнем!
          </button>
        </div>
      </section>

      {/* Подвал */}
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-8 mb-4">
            <Link to="/about" className="text-red-600 hover:text-red-700">О нас</Link>
            <Link to="/contact" className="text-red-600 hover:text-red-700">Контакты</Link>
            <Link to="/terms" className="text-red-600 hover:text-red-700">Условия обслуживания</Link>
            <Link to="/privacy" className="text-red-600 hover:text-red-700">Политика конфиденциальности</Link>
          </div>
          <p className="text-sm text-gray-600">
            <span className="mr-1">@</span> ©2024 Game Tester. Все права защищены.
          </p>
        </div>
      </footer>
   </div>
  );
};