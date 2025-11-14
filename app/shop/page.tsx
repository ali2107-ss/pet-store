import React from 'react';
import { ShoppingCart, Heart, Search } from 'lucide-react';

// Моковые данные о товарах
const products = [
  { id: 1, name: 'Сухой корм для котят', price: 1200, category: 'Еда', image: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Корм', rating: 4.5 },
  { id: 2, name: 'Мягкий домик-лежанка', price: 2500, category: 'Аксессуары', image: 'https://placehold.co/400x300/F97316/FFFFFF?text=Домик', rating: 5.0 },
  { id: 3, name: 'Игрушка-мышка (3 шт.)', price: 350, category: 'Игрушки', image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Игрушка', rating: 4.0 },
  { id: 4, name: 'Витамины для шерсти', price: 890, category: 'Здоровье', image: 'https://placehold.co/400x300/EF4444/FFFFFF?text=Витамины', rating: 4.8 },
];

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition">
        <Heart className="w-5 h-5" fill="currentColor" />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-indigo-600 mb-1">{product.category}</span>
      <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto pt-2">
        <p className="text-xl font-extrabold text-indigo-700">{product.price} ₽</p>
        <button className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-150 shadow-md">
          <ShoppingCart className="w-4 h-4 mr-1" />
          В корзину
        </button>
      </div>
    </div>
  </div>
);

const ShopPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Наш Зоомагазин
        </h1>
        
        {/* Панель поиска и фильтрации */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 md:w-1/4">
              <option>Все категории</option>
              <option>Еда</option>
              <option>Аксессуары</option>
              <option>Игрушки</option>
              <option>Здоровье</option>
            </select>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Добавим еще несколько карточек, чтобы заполнить макет */}
          <ProductCard key={5} product={{ id: 5, name: 'Большой лоток для кошек', price: 950, category: 'Аксессуары', image: 'https://placehold.co/400x300/06B6D4/FFFFFF?text=Лоток', rating: 4.2 }} />
          <ProductCard key={6} product={{ id: 6, name: 'Наполнитель (5 кг)', price: 400, category: 'Гигиена', image: 'https://placehold.co/400x300/EC4899/FFFFFF?text=Наполнитель', rating: 4.6 }} />
          <ProductCard key={7} product={{ id: 7, name: 'Ошейник со светлячком', price: 590, category: 'Аксессуары', image: 'https://placehold.co/400x300/8B5CF6/FFFFFF?text=Ошейник', rating: 4.1 }} />
          <ProductCard key={8} product={{ id: 8, name: 'Влажный корм для взрослых котов', price: 1500, category: 'Еда', image: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Влажный+корм', rating: 4.9 }} />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;