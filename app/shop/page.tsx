"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const products: Product[] = [
  { id: 1, name: 'Сухой корм для собак', price: 1200, category: 'Еда', image: 'https://placehold.co/400x300/FFD166/000000?text=Корм', rating: 4.5 },
  { id: 2, name: 'Мягкая игрушка', price: 350, category: 'Игрушки', image: 'https://placehold.co/400x300/06D6A0/000000?text=Игрушка', rating: 4.0 },
  { id: 3, name: 'Когтеточка', price: 1290, category: 'Аксессуары', image: 'https://placehold.co/400x300/EF476F/FFFFFF?text=Когтеточка', rating: 4.3 },
  { id: 4, name: 'Шампунь для кошек', price: 450, category: 'Здоровье', image: 'https://placehold.co/400x300/118AB2/FFFFFF?text=Шампунь', rating: 4.1 },
  { id: 5, name: 'Большой лоток для кошек', price: 950, category: 'Аксессуары', image: 'https://placehold.co/400x300/06B6D4/FFFFFF?text=Лоток', rating: 4.2 },
  { id: 6, name: 'Наполнитель (5 кг)', price: 400, category: 'Гигиена', image: 'https://placehold.co/400x300/EC4899/FFFFFF?text=Наполнитель', rating: 4.6 },
  { id: 7, name: 'Ошейник со светлячком', price: 590, category: 'Аксессуары', image: 'https://placehold.co/400x300/8B5CF6/FFFFFF?text=Ошейник', rating: 4.1 },
  { id: 8, name: 'Влажный корм для взрослых котов', price: 1500, category: 'Еда', image: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Влажный+корм', rating: 4.9 },
];

interface CartItem extends Product {
  quantity: number;
}

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product) => void }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [animate, setAnimate] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ x: rect.left, y: rect.top });
      setAnimate(true);
      onAddToCart(product);
      setTimeout(() => setAnimate(false), 600); // после анимации скрываем
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <button title="Добавить в избранное" className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition">
            <Heart className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs font-semibold text-indigo-600 mb-1">{product.category}</span>
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">{product.name}</h3>
          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="text-xl font-extrabold text-indigo-700">{product.price} ₽</p>
            <button
              ref={buttonRef}
              className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md transition duration-150"
              onClick={handleClick}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              В корзину
            </button>
          </div>
        </div>
      </div>

      {animate && (
        <div
          className="fixed w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full shadow-lg z-50 animate-fly-to-cart"
          style={{
            left: coords.x,
            top: coords.y,
          }}
        >
          <ShoppingCart className="w-5 h-5" />
        </div>
      )}

      <style jsx>{`
        @keyframes fly-to-cart {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(100vw - ${coords.x + 50}px), -${coords.y + 50}px) scale(0.2);
            opacity: 0;
          }
        }
        .animate-fly-to-cart {
          animation: fly-to-cart 0.6s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

const ShopPage = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Наш Зоомагазин
        </h1>

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
              <option>Гигиена</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
