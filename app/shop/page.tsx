"use client";

import React from 'react';
import { ShoppingCart, Heart, Search } from 'lucide-react';

// Моковые данные о товарах
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const products: Product[] = [
  { id: 1, name: 'Сухой корм для собак', price: 6500, category: 'Еда', image: 'https://avatars.mds.yandex.net/get-mpic/1853752/2a0000018b1749316f0ff8f46c168db2c78a/orig', rating: 4.5 },
  { id: 2, name: 'Мягкая игрушка', price: 1800, category: 'Игрушки', image: 'https://avatars.mds.yandex.net/i?id=f47ee48fd958c75fff65b2825ac5540bc84ec34b-5227767-images-thumbs&n=13', rating: 4.0 },
  { id: 3, name: 'Когтеточка', price: 8900, category: 'Аксессуары', image: 'https://avatars.mds.yandex.net/get-mpic/5297750/2a0000019545ce79c0c1fe257ceaa5993750/orig', rating: 4.3 },
  { id: 4, name: 'Шампунь для кошек', price: 2400, category: 'Здоровье', image: 'https://avatars.mds.yandex.net/get-mpic/14026497/2a00000195a608e925b2976d7005dd0f1216/9hq', rating: 4.1 },
  // Дополнительные товары (цены примерные в тенге)
  { id: 5, name: 'Большой лоток для кошек', price: 4500, category: 'Аксессуары', image: 'https://ir.ozone.ru/s3/multimedia-q/6891272558.jpg', rating: 4.2 },
  { id: 6, name: 'Наполнитель (5 кг)', price: 2100, category: 'Гигиена', image: 'https://cdn1.ozone.ru/s3/multimedia-h/c600/6333120401.jpg', rating: 4.6 },
  { id: 7, name: 'Ошейник со светлячком', price: 3200, category: 'Аксессуары', image: 'https://avatars.mds.yandex.net/i?id=526d54771b077aa45db04c4d2bc52cbe_l-5275490-images-thumbs&n=13', rating: 4.1 },
  { id: 8, name: 'Влажный корм для котов', price: 450, category: 'Еда', image: 'https://avatars.mds.yandex.net/i?id=2e8dd6872ddba35af48fde5d9639f16aa075a83f-4578697-images-thumbs&n=13', rating: 4.9 },
];

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
      <button title="Add to favorites" className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition">
        <Heart className="w-5 h-5" fill="currentColor" />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-indigo-600 mb-1">{product.category}</span>
      <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center justify-between mt-auto pt-2">
        {/* ИЗМЕНЕНИЕ ЗДЕСЬ: Добавлено форматирование и знак тенге */}
        <p className="text-xl font-extrabold text-indigo-700">
            {product.price.toLocaleString()} ₸
        </p>
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
            
            <select aria-label="Фильтр по категориям" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 md:w-1/4">
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
        </div>
      </div>
    </div>
  );
};

export default ShopPage;