"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, Search, Home, DollarSign, Package, X, ArrowUpDown } from 'lucide-react';

// --- ИНТЕРФЕЙС PRODUCT ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
  stock: number;
  createdAt: number; // Таймстемп для сортировки "Новинки"
}

// Контексты (заглушки для автономности примера, если нет внешних)
const useCart = () => ({ addToCart: (p: any) => console.log('Added to cart', p) });
const useFavorites = () => ({ 
  addToFavorites: (p: any) => {}, 
  removeFromFavorites: (id: any) => {}, 
  isFavorite: (id: any) => false 
});

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

const ProductDetailModal = ({ product, onClose, onAddToCart }: { product: Product, onClose: () => void, onAddToCart: (product: Product) => void }) => {
  const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
        <div className="p-8 overflow-y-auto flex-grow relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition z-10"><X className="w-6 h-6"/></button>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x450/E5E7EB/4B5563?text=Нет+Фото"; }}
              />
            </div>
            <div className="md:col-span-1 flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-indigo-600 mb-1 uppercase">{product.category}</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h2>
                <div className="flex items-center mb-6">
                  <RatingStars rating={product.rating} />
                  <span className="text-base text-gray-500 ml-2">({product.rating.toFixed(1)}/5)</span>
                </div>
                <p className="text-gray-700 mb-6 leading-loose text-lg">{product.description}</p>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                    <p className="text-lg font-semibold text-indigo-800">Наличие на складе:</p>
                    <p className={`text-3xl font-bold ${stockColor}`}>
                        {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
                    </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-4xl font-extrabold text-green-700">{product.price} ₸</p>
                <button
                  className={`flex items-center text-white px-8 py-4 rounded-full text-lg font-bold transition duration-150 shadow-xl ${product.stock > 0 ? 'bg-green-600 hover:bg-green-700 shadow-green-400/50 transform hover:scale-[1.01]' : 'bg-gray-400 cursor-not-allowed'}`}
                  onClick={() => { onAddToCart(product); onClose(); }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onOpenDetails, triggerAnimation, onToggleFavorite, isFavorite }: any) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x300/E5E7EB/4B5563?text=Нет+Фото"; }}
      />
      <button 
        onClick={() => onToggleFavorite(product)}
        className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-md transition transform hover:scale-110 ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      >
        <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <span className="text-xs font-semibold text-indigo-600 mb-1 uppercase">{product.category}</span>
      <h3 
        className="text-lg font-bold text-gray-900 mb-2 flex-grow hover:text-indigo-600 transition duration-150 cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        {product.name}
      </h3>
      <div className="flex items-center mb-3">
        <RatingStars rating={product.rating} />
        <span className="text-xs text-gray-500 ml-2">({product.rating.toFixed(1)})</span>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <p className="text-2xl font-extrabold text-indigo-700">{product.price} ₸</p> 
        <button 
          className={`flex items-center text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-150 shadow-lg transform hover:translate-y-[-1px] ${product.stock > 0 ? 'bg-green-600 hover:bg-green-700 shadow-green-300/50' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={() => { if (product.stock > 0) { onAddToCart(product); triggerAnimation(); } }}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock > 0 ? 'В корзину' : 'Нет'}
        </button>
      </div>
    </div>
  </div>
);

const ShopPage = ({ initialProducts }: { initialProducts?: Product[] }) => {
  // Статические данные для демонстрации
  const staticProducts: Product[] = [
    { id: 1, name: 'Сухой корм для собак', price: 6000, category: 'Еда', image: 'https://images.unsplash.com/photo-1585837505264-184856f61701?q=80&w=400&auto=format&fit=crop', rating: 4.5, description: 'Корм премиум-класса.', stock: 50, createdAt: 1704067200000 },
    { id: 2, name: 'Мягкая игрушка "Мышка"', price: 1750, category: 'Игрушки', image: 'https://images.unsplash.com/photo-1548546738-8509cb246ed3?q=80&w=400&auto=format&fit=crop', rating: 4.0, description: 'Для кошек.', stock: 15, createdAt: 1712121200000 },
    { id: 3, name: 'Когтеточка "Башня"', price: 6450, category: 'Аксессуары', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=400&auto=format&fit=crop', rating: 4.8, description: 'Высокая башня.', stock: 5, createdAt: 1730000000000 },
    { id: 4, name: 'Шампунь для кошек', price: 2250, category: 'Здоровье', image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400&auto=format&fit=crop', rating: 4.1, description: 'Бережный уход.', stock: 22, createdAt: 1725000000000 },
  ];

  const productsToUse = initialProducts && initialProducts.length > 0 ? initialProducts : staticProducts;
  
  // Состояния фильтров
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [sortBy, setSortBy] = useState('newest'); // 'cheap', 'expensive', 'rating', 'newest'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [flyCart, setFlyCart] = useState(false);

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const categories = useMemo(() => {
    const uniqueCategories = new Set(productsToUse.map(p => p.category));
    return ['Все категории', ...Array.from(uniqueCategories)].sort();
  }, [productsToUse]);

  // КОМПЛЕКСНАЯ ФИЛЬТРАЦИЯ И СОРТИРОВКА
  const processedProducts = useMemo(() => {
    let result = [...productsToUse];

    // 1. Поиск
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Категория
    if (selectedCategory !== 'Все категории') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Сортировка
    result.sort((a, b) => {
      switch (sortBy) {
        case 'cheap':
          return a.price - b.price;
        case 'expensive':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    return result;
  }, [selectedCategory, sortBy, searchTerm, productsToUse]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: `${product.price}`,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative pb-20">
      {flyCart && (
        <div className="fixed w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fly-to-top-right z-50">
          <ShoppingCart className="w-5 h-5"/>
        </div>
      )}

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center flex items-center justify-center">
            <Home className="w-10 h-10 mr-4 text-indigo-600"/>
            Наш Зоомагазин
          </h1>

          {/* ПАНЕЛЬ ФИЛЬТРОВ И СОРТИРОВКИ */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex flex-col gap-6">
              {/* Поиск */}
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Поиск по названию или описанию..." 
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 placeholder-gray-400" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Селекторы */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Категории */}
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Категория</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900 transition" 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Сортировка (НОВОЕ) */}
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Сортировать по</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900 appearance-none transition" 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Новинки</option>
                      <option value="cheap">Сначала дешевые</option>
                      <option value="expensive">Сначало дорогие</option>
                      <option value="rating">Высокий рейтинг</option>
                    </select>
                    <ArrowUpDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {processedProducts.length === 0 && (
              <div className="mt-8 text-center py-10">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Ничего не нашли. Попробуйте изменить параметры поиска.</p>
              </div>
            )}
          </div>

          {/* СЕТКА ТОВАРОВ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {processedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                triggerAnimation={() => { setFlyCart(true); setTimeout(() => setFlyCart(false), 600); }}
                onOpenDetails={setSelectedProduct}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart} 
        />
      )}

      <style jsx>{`
        @keyframes fly-to-top-right {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(50vw - 40px), -50vh) scale(0.3); opacity: 0; }
        }
        .animate-fly-to-top-right {
          animation: fly-to-top-right 0.6s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ShopPage;