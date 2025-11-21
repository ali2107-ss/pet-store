"use client";

import React from 'react';
import { ShoppingCart, ArrowRight, Star, Tag } from 'lucide-react';

const CategoryCard = ({ title, image, color }: { title: string; image: string; color: string }) => (
  <div className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02]`} style={{ borderColor: color }}>
    <div className="h-40 relative">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className={`absolute inset-0 bg-opacity-10`} style={{ backgroundColor: color }}></div>
    </div>
    <div className="p-4 flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-1 transition" />
    </div>
  </div>
);

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    rating: number;
}

const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button type="button" title="Добавить в избранное" aria-label="Добавить в избранное" className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition">
          <Tag className="w-5 h-5" fill="currentColor" aria-hidden="true" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex-grow">{product.name}</h3>
        <div className="flex items-center text-yellow-500 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
            ))}
            <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-xl font-extrabold text-indigo-700">{product.price} ₽</p>
          <button className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-150 shadow-md">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Купить
          </button>
        </div>
      </div>
    </div>
);

const HomePage = () => {
    
    // Моковые данные
    const categories = [
        { title: 'Для кошек', image: 'https://placehold.co/600x400/d8e2f0/333333?text=Для+кошек', color: '#8B5CF6' },
        { title: 'Для собак', image: 'https://placehold.co/600x400/f0e7d8/333333?text=Для+собак', color: '#F59E0B' },
        { title: 'Грызуны и птицы', image: 'https://placehold.co/600x400/d8f0e1/333333?text=Грызуны+и+птицы', color: '#10B981' },
    ];
    
    const featuredProducts = [
        { id: 1, name: 'Сухой корм ProCat', price: 1200, image: 'https://placehold.co/400x300/4F46E5/FFFFFF?text=Корм', rating: 4.8 },
        { id: 2, name: 'Мягкая лежанка Premium', price: 2500, image: 'https://placehold.co/400x300/F97316/FFFFFF?text=Лежанка', rating: 5.0 },
        { id: 3, name: 'Игрушка-дразнилка', price: 350, image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Игрушка', rating: 4.5 },
        { id: 4, name: 'Наполнитель (5 кг)', price: 400, image: 'https://placehold.co/400x300/EF4444/FFFFFF?text=Наполнитель', rating: 4.9 },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Главный баннер */}
                <div className="relative bg-indigo-100 rounded-3xl overflow-hidden shadow-2xl mb-12 h-64 sm:h-96">
                    <img
                        src="https://placehold.co/1000x600/a3bfb8/ffffff?text=Happy+Pets"
                        alt="Баннер: Happy Pets"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center p-8 sm:p-16">
                        <div className="max-w-xl">
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                                Всё для Вашего любимца
                            </h1>
                            <p className="mt-3 sm:mt-5 text-lg sm:text-xl text-indigo-100">
                                Доставка кормов и аксессуаров по всей стране.
                            </p>
                            <a 
                                href="/shop"
                                className="mt-5 sm:mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-lg"
                            >
                                Перейти в Магазин
                            </a>
                        </div>
                    </div>
                </div>

                {/* Раздел Категории */}
                <section className="mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                        Популярные Категории
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map(cat => (
                            <CategoryCard key={cat.title} {...cat} />
                        ))}
                    </div>
                </section>

                {/* Раздел Рекомендуемые товары */}
                <section className="mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                        Хиты продаж
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Дополнительный блок - Акция */}
                <div className="bg-green-600 rounded-2xl p-8 text-white text-center shadow-xl">
                    <h3 className="text-3xl font-extrabold mb-2">
                        Скидка 15% на первый заказ!
                    </h3>
                    <p className="text-lg text-green-100 mb-4">
                        Используйте промокод: HAPPYPETS
                    </p>
                    <a href="/login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-green-600 bg-white hover:bg-gray-100 transition duration-150 shadow-lg">
                        Получить скидку
                    </a>
                </div>

            </div>
        </div>
    );
};

export default HomePage; 