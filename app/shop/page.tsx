"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, Search, Home, DollarSign, Package, X } from 'lucide-react';

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
}

// --- СПИСОК ТОВАРОВ ---
const products: Product[] = [
  { id: 1, name: 'Сухой корм для собак', price: 6000, category: 'Еда', image: 'korm.jpg', rating: 4.5, description: 'Полнорационный, сбалансированный сухой корм премиум-класса, обогащенный витаминами и минералами для поддержания здоровья и активности вашей собаки.', stock: 50 },
  { id: 2, name: 'Мягкая игрушка "Мышка"', price: 1750, category: 'Игрушки', image: 'igrushka.jpg', rating: 4.0, description: 'Безопасная и мягкая игрушка для кошек, изготовленная из экологически чистых материалов. Идеальна для охоты и игр.', stock: 15 },
  { id: 3, name: 'Когтеточка "Башня"', price: 6450, category: 'Аксессуары', image: 'kogtetochka.jpg', rating: 4.3, description: 'Высокая многоуровневая когтеточка-башня. Помогает сохранить мебель и обеспечить кошке место для лазания и отдыха.', stock: 5 },
  { id: 4, name: 'Шампунь для кошек', price: 2250, category: 'Здоровье', image: 'shampun.jpg', rating: 4.1, description: 'Гипоаллергенный шампунь с натуральными экстрактами для бережного ухода за шерстью кошек. Придает блеск и приятный аромат.', stock: 22 },
  { id: 5, name: 'Большой лоток для кошек', price: 4750, category: 'Гигиена', image: 'lotok.jpg', rating: 4.2, description: 'Просторный закрытый лоток с угольным фильтром. Идеально подходит для больших кошек и обеспечивает максимальную гигиену.', stock: 8 },
  { id: 6, name: 'Наполнитель (5 кг)', price: 2000, category: 'Гигиена', image: 'napolnitel.jpg', rating: 4.6, description: 'Комкующийся бентонитовый наполнитель с высокой абсорбирующей способностью. Устраняет неприятные запахи.', stock: 40 },
  { id: 7, name: 'Ошейник со светлячком', price: 2950, category: 'Аксессуары', image: 'osheinik.jpg', rating: 4.1, description: 'Светящийся в темноте ошейник для собак, обеспечивающий безопасность во время вечерних прогулок. Регулируемый размер.', stock: 18 },
  { id: 8, name: 'Влажный корм для взрослых котов', price: 7500, category: 'Еда', image: 'vlazhniykorm.jpg', rating: 4.9, description: 'Набор из 20 паучей с разными вкусами. Сбалансированный влажный корм с высоким содержанием мяса для здоровья мочевыводящей системы.', stock: 30 },
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

// --- КОМПОНЕНТ ДЕТАЛЕЙ ТОВАРА (ОБНОВЛЕННЫЙ) ---

const ProductDetailModal = ({ product, onClose, onAddToCart }: { product: Product, onClose: () => void, onAddToCart: (product: Product) => void }) => {
  const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600';

  return (
    // ИЗМЕНЕНИЕ: Заменен bg-black bg-opacity-40 на bg-white bg-opacity-90
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

// --- ProductCard ---

const ProductCard = ({ product, onAddToCart, onOpenDetails, triggerAnimation }: { product: Product, onAddToCart: (product: Product) => void, onOpenDetails: (product: Product) => void, triggerAnimation: () => void }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
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
      {/* Сделали заголовок кликабельным */}
      <h3 
        className="text-lg font-bold text-gray-900 mb-2 flex-grow hover:text-indigo-600 transition duration-150 cursor-pointer"
        onClick={() => onOpenDetails(product)} // Открываем модальное окно при клике
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
          className={`flex items-center text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-150 shadow-lg shadow-green-300/50 transform hover:translate-y-[-1px] ${product.stock > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
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
  
  // Состояние для деталей товара
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Анимация корзины
  const [flyCart, setFlyCart] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь использовалась бы база данных (например, Firestore)
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
      // Имитация уменьшения стока (только для визуального отображения в модалке, фактический сток не меняется)
      // В реальном приложении это делалось бы на сервере
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
	
  // Функции для модального окна деталей
  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
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
            Pet Store
          </div>
          {/* Кнопка Корзины */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-150 relative shadow-md"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Корзина
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold border-2 border-white">{totalItems}</span>
            )}
          </button>
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
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                triggerAnimation={triggerAnimation}
                onOpenDetails={handleOpenDetails} // Передача обработчика
              />
            ))}
          </div>
        </div>
      </main>

      {/* Модальное окно деталей товара */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={handleCloseDetails} 
          onAddToCart={handleAddToCart} 
        />
      )}

      {/* Существующий попап Корзины */}
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
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-md mr-4" 
                    onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/48x48/E5E7EB/4B5563?text=Нет+Фото"; }}
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x {item.price} ₸</p>
                  </div>
                  <p className="font-bold text-lg text-indigo-700">{item.price * item.quantity} ₸</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                <p className="text-xl font-bold text-gray-900">Итого:</p>
                <p className="text-3xl font-extrabold text-indigo-700">{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} ₸</p>
              </div>
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