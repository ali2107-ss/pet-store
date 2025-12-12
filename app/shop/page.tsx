"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, Search, Home, Package, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const products: Product[] = [
  { id: 1, name: 'Сухой корм для собак', price: 6000, category: 'Еда', image: 'korm.jpg', rating: 4.5 },
  { id: 2, name: 'Мягкая игрушка "Мышка"', price: 1750, category: 'Игрушки', image: 'igrushka.jpg', rating: 4.0 },
  { id: 3, name: 'Когтеточка "Башня"', price: 6450, category: 'Аксессуары', image: 'kogtetochka.jpg', rating: 4.3 },
  { id: 4, name: 'Шампунь для кошек', price: 2250, category: 'Здоровье', image: 'shampun.jpg', rating: 4.1 },
  { id: 5, name: 'Большой лоток для кошек', price: 4750, category: 'Гигиена', image: 'lotok.jpg', rating: 4.2 },
  { id: 6, name: 'Наполнитель (5 кг)', price: 2000, category: 'Гигиена', image: 'napolnitel.jpg', rating: 4.6 },
  { id: 7, name: 'Ошейник со светлячком', price: 2950, category: 'Аксессуары', image: 'osheinik.jpg', rating: 4.1 },
  { id: 8, name: 'Влажный корм для взрослых котов', price: 7500, category: 'Еда', image: 'vlazhniykorm.jpg', rating: 4.9 },
];

interface CartItem extends Product {
  quantity: number;
}

// ---------- РЕЙТИНГ ----------
const RatingStars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex text-sm space-x-0.5">
      {Array(full).fill(0).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
      {half && <span className="text-yellow-400">½</span>}
      {Array(empty).fill(0).map((_, i) => <span key={i} className="text-gray-300">★</span>)}
    </div>
  );
};

// ---------- КАРТОЧКА ТОВАРА ----------
const ProductCard = ({ product, onAddToCart, triggerAnimation }: any) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden border flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        className="w-full h-full object-cover hover:scale-105 transition"
        onError={(e: any) => { e.currentTarget.src = "https://placehold.co/400x300?text=Нет+Фото"; }}
      />
      <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow">
        <Heart className="w-5 h-5" fill="currentColor" />
      </button>
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <p className="text-xs text-indigo-600 uppercase mb-1">{product.category}</p>
      <h3 className="text-lg font-bold mb-2 flex-grow">{product.name}</h3>

      <div className="flex items-center mb-3">
        <RatingStars rating={product.rating} />
        <span className="text-xs text-gray-500 ml-2">{product.rating.toFixed(1)}</span>
      </div>

      <div className="flex justify-between items-center mt-auto pt-2 border-t">
        <p className="text-2xl font-extrabold text-indigo-700">{product.price} ₸</p>
        <button
          onClick={() => { onAddToCart(product); triggerAnimation(); }}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзину
        </button>
      </div>
    </div>
  </div>
);

// ---------- ОСНОВНОЙ КОМПОНЕНТ ----------
const ShopPage = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
      catch { return []; }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [searchTerm, setSearchTerm] = useState("");
  const [flyCart, setFlyCart] = useState(false);

  // сохраняем корзину
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // категории
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ["Все категории", ...Array.from(set)];
  }, []);

  // фильтр
  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedCategory !== "Все категории")
      list = list.filter(p => p.category === selectedCategory);

    if (searchTerm)
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return list;
  }, [selectedCategory, searchTerm]);

  // Добавление в корзину
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found)
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const triggerAnimation = () => {
    setFlyCart(true);
    setTimeout(() => setFlyCart(false), 600);
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ЛЕТЯЩАЯ КОРЗИНА */}
      {flyCart && (
        <div className="fixed w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fly-to-top-right z-50">
          <ShoppingCart className="w-5 h-5" />
        </div>
      )}

      {/* ---------- ХЕДЕР С КНОПКОЙ КОРЗИНЫ ---------- */}
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center text-2xl font-bold text-indigo-700">
            <Package className="w-7 h-7 mr-2 text-indigo-600" />
            Pet Store
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Корзина ({totalItems})
          </button>
        </div>
      </header>

      {/* ---------- ПОИСК + ФИЛЬТР ---------- */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold mb-12 text-center flex justify-center">
            <Home className="w-10 h-10 mr-3 text-indigo-600" />
            Наш Зоомагазин
          </h1>

          <div className="bg-white p-6 rounded-2xl shadow mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                  placeholder="Поиск товаров..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <select
                className="px-4 py-3 border rounded-lg md:w-1/4"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* ---------- ТОВАРЫ ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={handleAddToCart}
                triggerAnimation={triggerAnimation}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ---------- МОДАЛЬНАЯ КОРЗИНА ---------- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-bold flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-indigo-600" />
                Ваша Корзина ({totalItems})
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="py-10 text-center text-gray-500">Корзина пуста</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center border-b py-3">
                  <img src={item.image} className="w-12 h-12 rounded mr-4" />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × {item.price} ₸</p>
                  </div>
                  <p className="font-bold text-indigo-700">{item.price * item.quantity} ₸</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        © {new Date().getFullYear()} Pet Store
      </footer>

      {/* ---------- CSS АНИМАЦИЯ ---------- */}
      <style jsx>{`
        @keyframes fly-to-top-right {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(50vw - 40px), -40px) scale(0.3); opacity: 0; }
        }
        .animate-fly-to-top-right {
          animation: fly-to-top-right 0.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
