"use client";

import React from "react";
import { ShoppingCart, ArrowRight, Star, Tag, Truck, ShieldCheck, Heart } from "lucide-react";

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

// Компонент карточки категории
const CategoryCard: React.FC<Category> = ({ title, image }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
    <img
      src={image}
      alt={title}
      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
        Перейти <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  </div>
);

// Компонент карточки "Хит продаж"
const FeaturedProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
    <div className="relative h-56 bg-gray-50 p-4 flex items-center justify-center">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-full">
        ХИТ
      </div>
      <button
        type="button"
        title={`Добавить ${product.name} в избранное`}
        aria-label={`Добавить ${product.name} в избранное`}
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
      >
        <span className="sr-only">Добавить {product.name} в избранное</span>
        <Heart className="w-5 h-5" />
      </button>
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
          aria-label={`Добавить ${product.name} в корзину`}
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-indigo-200"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const categories: Category[] = [
    { title: "Для кошек", image: "/кошка.png", color: "#3B82F6" },
    { title: "Для собак", image: "/собака.png", color: "#EF4444" },
    { title: "Грызуны и птицы", image: "/птицы.png", color: "#22C55E" },
  ];

  const featuredProducts: Product[] = [
    { id: 1, name: "Сухой корм ProCat (2кг)", category: "Еда", price: 4200, image: "https://basket-12.wbbasket.ru/vol1825/part182549/182549714/images/big/1.webp" },
    { id: 2, name: "Лежанка Royal Soft", category: "Уют", price: 12500, image: "https://avatars.mds.yandex.net/get-mpic/5216590/2a000001958c2a78096b691c1f2b56b92b7c/orig" },
    { id: 3, name: "Интерактивная мышь", category: "Игрушки", price: 3350, image: "https://avatars.mds.yandex.net/i?id=daaede52da5e3bbf1c711d7ab18e7664652d8bc3-4440117-images-thumbs&n=13" },
    { id: 4, name: "Шампунь для шерсти", category: "Уход", price: 2400, image: "https://avatars.mds.yandex.net/i?id=c9e307f8ebc5ff71dd9b59f53649d877_l-10036219-images-thumbs&n=13" },
  ];

  const features: Feature[] = [
    { icon: Truck, title: "Быстрая доставка", desc: "По городу в день заказа" },
    { icon: ShieldCheck, title: "Гарантия качества", desc: "Только сертифицированные товары" },
    { icon: Tag, title: "Лучшие цены", desc: "Регулярные скидки и акции" },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* === HERO SECTION === */}
      <div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between py-16 md:py-24">
            {/* Текст */}
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
                <a href="/shop" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                  Перейти в каталог
                </a>
                <a href="/reviews" className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                  Отзывы
                </a>
              </div>
            </div>

            {/* Картинка */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center md:justify-end relative">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
                <div className="absolute top-0 right-0 w-full h-full bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <img
                  src="/кошкасобака.png"
                  alt="Pets"
                  className="relative z-10 w-full h-full object-contain drop-shadow-lg animate-bounce"
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

           

            {/* === АКЦИЯ (БАННЕР ВНИЗУ) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden shadow-2xl">
                    {/* Декор фона */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div className="max-w-xl mb-8 md:mb-0">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                                Скидка 15% <br/> на первый заказ!
                            </h2>
                            <p className="text-indigo-100 text-lg mb-8">
                                Зарегистрируйтесь сегодня и используйте промокод <span className="bg-white/20 px-2 py-1 rounded font-mono font-bold text-white">HAPPYPETS</span> при оформлении.
                            </p>
                            <a href="/login" className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
                                Получить скидку
                            </a>
                        </div>
                        {/* Декоративная картинка подарка */}
                        <div className="w-48 md:w-64">
                            
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
      </div>


  );
};

export default HomePage;
