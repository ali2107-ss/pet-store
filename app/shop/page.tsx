"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, Search, Home, DollarSign, Package, X } from 'lucide-react';

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

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
  if (hasHalfStar) stars.push(<span key="half" className="text-yellow-400">½</span>);
  for (let i = 0; i < emptyStars; i++) stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);

  return <div className="flex text-sm space-x-0.5">{stars}</div>;
};

const ProductCard = ({ product, onAddToCart, triggerAnimation }: { product: Product, onAddToCart: (product: Product) => void, triggerAnimation: () => void }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        // Внимание: если вы не загрузите эти файлы в проект, будет показан плейсхолдер
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x300/E5E7EB/4B5563?text=Нет+Фото"; }}
      />
      <button title="Добавить в избранное" className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition transform hover:scale-110">
        <Heart className="w-5 h-5" fill="currentColor" />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-indigo-600 mb-1 uppercase">{product.category}</span>
      <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center mb-3">
        <RatingStars rating={product.rating} />
        <span className="text-xs text-gray-500 ml-2">({product.rating.toFixed(1)})</span>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <p className="text-2xl font-extrabold text-indigo-700">{product.price} ₸</p> 
        <button 
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-150 shadow-lg shadow-green-300/50 transform hover:translate-y-[-1px]" 
          onClick={() => { onAddToCart(product); triggerAnimation(); }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзину
        </button>
      </div>
    </div>
  </div>
);

// --- Главный компонент магазина ---

const ShopPage = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [searchTerm, setSearchTerm] = useState('');

  // Анимация корзины
  const [flyCart, setFlyCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return ['Все категории', ...Array.from(uniqueCategories)].sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let currentProducts = products;
    if (selectedCategory !== 'Все категории') currentProducts = currentProducts.filter(p => p.category === selectedCategory);
    if (searchTerm) currentProducts = currentProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return currentProducts;
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      else return [...prev, { ...product, quantity: 1 }];
    });
  };

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const triggerAnimation = () => {
    setFlyCart(true);
    setTimeout(() => setFlyCart(false), 600);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative">
        {/* Анимация «летящей» корзины */}
        {flyCart && (
          <div className="fixed w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fly-to-top-right z-50">
            <ShoppingCart className="w-5 h-5"/>
          </div>
        )}

        {/* Хедер */}
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center text-2xl font-bold text-indigo-700 tracking-tight cursor-pointer">
                    <Package className='w-7 h-7 mr-2 text-indigo-600'/>
              
                </div>
            </div>
        </header>

        <main className="min-h-[80vh] py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center flex items-center justify-center">
                    <Home className="w-10 h-10 mr-4 text-indigo-600"/>
                    Наш Зоомагазин
                </h1>

                <div className="mb-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input type="text" placeholder="Поиск товаров..." className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <select aria-label="Фильтр по категориям" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 md:w-1/4 transition shadow-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {filteredProducts.length === 0 && (
                        <p className="mt-4 text-center text-lg text-red-500 font-medium">
                            Товары по выбранным фильтрам не найдены.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} triggerAnimation={triggerAnimation} />
                    ))}
                </div>
            </div>
        </main>

        {isCartOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center"><ShoppingCart className="w-6 h-6 mr-2 text-indigo-600"/> Ваша Корзина ({totalItems})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition"><X className="w-6 h-6"/></button>
              </div>
              {cart.length === 0 ? <p className="text-center py-10 text-gray-500">Корзина пуста. Добавьте товары!</p> :
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center border-b pb-3 last:border-b-0">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x {item.price} ₸</p>
                    </div>
                    <p className="font-bold text-lg text-indigo-700">{item.price * item.quantity} ₸</p>
                  </div>
                ))}
              </div>}
            </div>
          </div>
        )}

        <footer className="bg-gray-800 text-white mt-12 text-center py-6">
            &copy; {new Date().getFullYear()} Pet Store. Корзина сохраняется в браузере.
        </footer>

        {/* Анимация CSS */}
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
