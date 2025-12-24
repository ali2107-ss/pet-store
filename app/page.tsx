"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, 
  ArrowRight, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Tag, 
  X, 
  Instagram, 
  Send 
} from "lucide-react";

// Типы
interface Category {
  title: string;
  image: string;
  color: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface Feature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}

// --- Компонент модального окна с условиями ---
const PromoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="w-10 h-10 text-indigo-600" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Как получить -15%?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Выполните два простых шага, чтобы забрать свою скидку на первый заказ:
          </p>

          <div className="space-y-4 text-left mb-10">
            <div className="flex items-start p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="p-2 bg-blue-500 text-white rounded-lg mr-4 mt-1">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Подпишитесь на наш Telegram</p>
                <p className="text-sm text-gray-600">Будьте в курсе всех новинок и секретных акций нашего канала.</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-pink-50 rounded-2xl border border-pink-100">
              <div className="p-2 bg-pink-500 text-white rounded-lg mr-4 mt-1">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Отметьте нас в Stories</p>
                <p className="text-sm text-gray-600">При покупке товара отметьте наш аккаунт в своих сторис.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="https://t.me/Pet_store7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg text-center"
            >
              Перейти в Telegram
            </a>
            <button 
              onClick={onClose}
              className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент карточки категории
const CategoryCard: React.FC<Category> = ({ title, image }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
    <img
      src={image}
      alt={title}
      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
      onError={(e: any) => { e.currentTarget.src = "https://placehold.co/600x400?text=" + title; }}
    />
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
        Перейти <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories: Category[] = [
    { title: "Для кошек", image: "/кошка.png", color: "#3B82F6" },
    { title: "Для собак", image: "/собака.png", color: "#EF4444" },
    { title: "Грызуны и птицы", image: "/птицы.png", color: "#22C55E" },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      <PromoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* === HERO SECTION === */}
      <div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between py-16 md:py-24">
            <div className="w-full md:w-1/2 text-center md:text-left z-10">
              <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                🐾 Новый уровень заботы
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Счастье питомца <br />
                <span className="text-indigo-600">в один клик</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Тысячи товаров для ваших любимцев с доставкой до двери. Вкусные корма, уютные домики и веселые игрушки.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="/shop">
                <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                  Перейти в каталог
                </button>
                </a>
                 <a href="/reviews">
                <button className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                  Отзывы
                </button>
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center md:justify-end relative">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
                <div className="absolute top-0 right-0 w-full h-full bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <img
                  src="/кошкасобака.png"
                  alt="Pets"
                  className="relative z-10 w-full h-full object-contain drop-shadow-lg animate-bounce"
                  onError={(e: any) => { e.currentTarget.src = "https://placehold.co/500x500?text=Pets"; }}
                />
              </div>
            </div>
          </div>

          {/* === КАТЕГОРИИ === */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Популярные категории</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Найдите именно то, что нужно вашему пушистому (или пернатому) другу.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map(cat => (
                <CategoryCard key={cat.title} {...cat} />
              ))}
            </div>
          </section>

          {/* === АКЦИЯ (БАННЕР ВНИЗУ) === */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-xl mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                    Скидка 15% <br /> на первый заказ!
                  </h2>
                  <p className="text-indigo-100 text-lg mb-8">
                    Получите выгоду за простые действия в социальных сетях.
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    Получить скидку
                  </button>
                </div>
                <div className="w-48 md:w-64 flex justify-center">
                   <div className="bg-white/20 p-6 rounded-full backdrop-blur-md">
                      <Tag className="w-24 h-24 text-white animate-pulse" />
                   </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default App;