"use client";

import React, { useState } from "react";
import { ShoppingCart, ArrowRight, Truck, ShieldCheck, Tag, Heart } from "lucide-react";

// Компонент карточки категории
const CategoryCard = ({ title, image }: { title: string; image: string }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
    <img src={image} alt={title} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
        Перейти <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  </div>
);

// Компонент карточки продукта
const FeaturedProductCard = ({ product, addToCart }: { product: any; addToCart: (product: any) => void }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
    <div className="relative h-56 bg-gray-50 p-4 flex items-center justify-center">
      <img src={product.image} alt={product.name} className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
    </div>

    <div className="p-5">
      <div className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">{product.category}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div>
          <span className="text-xs text-gray-500 block">Цена</span>
          <span className="text-xl font-extrabold text-gray-900">{product.price} ₸</span>
        </div>
        <button
          type="button"
          title={`Добавить ${product.name} в корзину`}
          onClick={() => addToCart(product)}
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-200"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  // Массив товаров в корзине
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Функция добавления в корзину
  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.name} добавлен(а) в корзину`);
  };

  const categories = [
    { title: "Для кошек", image: "/кошка.png" },
    { title: "Для собак", image: "/собака.png" },
    { title: "Грызуны и птицы", image: "/птицы.png" },
  ];

  const featuredProducts = [
    { id: 1, name: "Сухой корм ProCat (2кг)", category: "Еда", price: 4200, image: "https://placehold.co/400x400/e0e7ff/4338ca?text=Корм" },
    { id: 2, name: "Лежанка Royal Soft", category: "Уют", price: 12500, image: "https://placehold.co/400x400/ffedd5/c2410c?text=Лежанка" },
    { id: 3, name: "Интерактивная мышь", category: "Игрушки", price: 3350, image: "https://placehold.co/400x400/fce7f3/be185d?text=Игрушка" },
    { id: 4, name: "Шампунь для шерсти", category: "Уход", price: 2400, image: "https://placehold.co/400x400/fae8ff/86198f?text=Шампунь" },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Хиты продаж</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {featuredProducts.map(product => (
          <FeaturedProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      <h2 className="text-3xl font-bold mt-12 mb-6">Популярные категории</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(cat => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
