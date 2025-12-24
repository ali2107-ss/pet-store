// Этот файл - твоя Главная страница (то, что видят по адресу "/")
// Написано на TypeScript

import Link from "next/link"; 
import Image from "next/image"; // Используем компонент Image, как положено в Next.js
import React from 'react'; // Явно импортируем React для TypeScript

// Компонент главной страницы
const Home: React.FC = () => {
  return (
    <section>
      {/* Hero-секция */}
      <div 
        className="relative bg-indigo-800 text-white rounded-xl shadow-2xl overflow-hidden p-8 md:p-16 flex items-center" 
        style={{ height: '500px' }} 
      >
        <div className="relative z-10 w-full md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Все для ваших любимцев</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Найдите лучшие корма, игрушки и аксессуары для счастливой жизни ваших питомцев.</p>
          
          <Link 
            href="/shop" 
            className="inline-block bg-white text-indigo-800 font-bold px-8 py-3 rounded-full text-lg hover:bg-gray-200 transition-transform hover:scale-105 shadow-xl"
          >
            Перейти в магазин
          </Link>
        </div>
        
        {/* Фоновое изображение (используем компонент Image) */}
        <Image
          src="https://placehold.co/1000x600/a3bfb8/ffffff?text=Happy+Pets" 
          alt="Счастливые питомцы" 
          fill // Заполняем контейнер
          priority // Указываем, что это главное изображение для быстрой загрузки
          style={{ objectFit: 'cover' }} // Сохраняем пропорции и обрезаем, если нужно
          className="opacity-30 z-0"
        />
      </div>

      {/* Популярные категории */}
      <h2 className="text-4xl font-bold text-center mt-16 mb-10 text-indigo-800">Популярные категории</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Категория 1: Собаки */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden group transform hover:translate-y-[-5px] transition-all duration-300">
          <Image 
            src="https://placehold.co/600x400/f0e7d8/333333?text=Для+собак" 
            alt="Для собак" 
            width={600}
            height={400}
            className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-700">Для собак</h3>
            <p className="text-gray-600 mb-4">Корма, ошейники, игрушки и многое другое.</p>
            <Link href="/shop" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Смотреть →</Link>
          </div>
        </div>
        
        {/* Категория 2: Кошки */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden group transform hover:translate-y-[-5px] transition-all duration-300">
          <Image 
            src="https://placehold.co/600x400/d8e2f0/333333?text=Для+кошек" 
            alt="Для кошек" 
            width={600}
            height={400}
            className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-700">Для кошек</h3>
            <p className="text-gray-600 mb-4">Когтеточки, наполнители, лакомства.</p>
            <Link href="/shop" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Смотреть →</Link>
          </div>
        </div>
        
        {/* Категория 3: Птицы */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden group transform hover:translate-y-[-5px] transition-all duration-300">
          <Image 
            src="https://placehold.co/600x400/d8f0e1/333333?text=Грызуны+и+птицы" 
            alt="Грызуны и птицы" 
            width={600}
            height={400}
            className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-2 text-indigo-700">Грызуны и птицы</h3>
            <p className="text-gray-600 mb-4">Клетки, кормушки и специальные корма.</p>
            <Link href="/shop" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Смотреть →</Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Home;