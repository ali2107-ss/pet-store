"use client";

import React, { useState, useEffect, useMemo } from 'react';
// Импортируем иконки для использования
import { ShoppingCart, Heart, Search, Home, DollarSign, Package, X } from 'lucide-react';

// --- ТИПЫ ДАННЫХ ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string; // В этом демо-приложении используется URL или имя файла
  rating: number;
}

// Моковые данные о товарах с именами файлов, предоставленными пользователем.
// ПРИМЕЧАНИЕ: В рабочем React-приложении эти файлы должны быть импортированы 
// или размещены в папке 'public' для корректной загрузки.
const products: Product[] = [
  { id: 1, name: 'Сухой корм для собак', price: 1200, category: 'Еда', 
    image: 'korm.jpg', rating: 4.5 },
  { id: 2, name: 'Мягкая игрушка "Мышка"', price: 350, category: 'Игрушки', 
    image: 'igrushka.jpg', rating: 4.0 },
  { id: 3, name: 'Когтеточка "Башня"', price: 1290, category: 'Аксессуары', 
    image: 'kogtetochka.jpg', rating: 4.3 },
  { id: 4, name: 'Шампунь для кошек', price: 450, category: 'Здоровье', 
    image: 'shampun.jpg', rating: 4.1 },
  { id: 5, name: 'Большой лоток для кошек', price: 950, category: 'Аксессуары', 
    image: 'lotok.jpg', rating: 4.2 },
  { id: 6, name: 'Наполнитель (5 кг)', price: 400, category: 'Гигиена', 
    image: 'napolnitel.jpg', rating: 4.6 },
  { id: 7, name: 'Ошейник со светлячком', price: 590, category: 'Аксессуары', 
    image: 'osheinik.jpg', rating: 4.1 },
  { id: 8, name: 'Влажный корм для взрослых котов', price: 1500, category: 'Еда', 
    image: 'vlazhniykorm.jpg', rating: 4.9 },
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

    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
        stars.push(<span key="half" className="text-yellow-400">½</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return <div className="flex text-sm space-x-0.5">{stars}</div>;
};

const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product) => void }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative h-48 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        // Добавляем обработку ошибки загрузки изображения.
        // Если изображение по имени файла не найдено, показываем плейсхолдер.
        onError={(e: any) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = "https://placehold.co/400x300/E5E7EB/4B5563?text=Нет+Фото"; 
        }}
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
        <p className="text-2xl font-extrabold text-indigo-700">{product.price} ₽</p>
        <button 
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-150 shadow-lg shadow-green-300/50 transform hover:translate-y-[-1px]" 
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          В корзину
        </button>
      </div>
    </div>
  </div>
);

const CartSummary = ({ totalItems, onOpenCart }: { totalItems: number, onOpenCart: () => void }) => (
    <div className="relative">
        <button 
            onClick={onOpenCart} 
            className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-indigo-400/50 hover:bg-indigo-700 transition transform hover:scale-105"
        >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Корзина
        </button>
        {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
            </span>
        )}
    </div>
);

const CartModal = ({ cart, onClose }: { cart: CartItem[], onClose: () => void }) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShoppingCart className="w-6 h-6 mr-2 text-indigo-600" /> 
                        Ваша Корзина ({totalItems})
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500">Корзина пуста. Добавьте товары!</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center border-b pb-3 last:border-b-0">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded-md mr-4"
                                        onError={(e: any) => { 
                                            e.currentTarget.onerror = null; 
                                            e.currentTarget.src = "https://placehold.co/12x12/E5E7EB/4B5563?text=N/A"; 
                                        }}
                                    />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} x {item.price} ₽</p>
                                    </div>
                                    <p className="font-bold text-lg text-indigo-700">{item.price * item.quantity} ₽</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg shadow-inner">
                            <div className="flex justify-between text-xl font-bold text-indigo-900">
                                <span>ИТОГО:</span>
                                <span>{totalAmount} ₽</span>
                            </div>
                        </div>

                        <button 
                            className="w-full mt-6 flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-150 shadow-lg"
                        >
                            <DollarSign className="w-5 h-5 mr-2"/> Оформить заказ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


// --- ГЛАВНЫЙ КОМПОНЕНТ ---
const ShopPage = () => {
  // Инициализация состояния корзины из localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Проверка window нужна для Next.js (хотя "use client" это по сути гарантирует)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Could not parse cart from localStorage", e);
        return [];
      }
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Увеличиваем количество
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        // Добавляем новый товар
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
        {/* Хедер */}
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center text-2xl font-bold text-indigo-700 tracking-tight cursor-pointer">
                    <Package className='w-7 h-7 mr-2 text-indigo-600'/>
                    Pet Store (Simple)
                </div>
                <CartSummary totalItems={totalItems} onOpenCart={() => setIsCartOpen(true)} />
            </div>
        </header>

        {/* Основное содержимое */}
        <main className="min-h-[80vh] py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center flex items-center justify-center">
                    <Home className="w-10 h-10 mr-4 text-indigo-600"/>
                    Наш Зоомагазин
                </h1>
                
                {/* Панель поиска и фильтрации */}
                <div className="mb-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Поиск товаров..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        
                        <select aria-label="Фильтр по категориям" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 md:w-1/4 transition shadow-sm">
                            <option>Все категории</option>
                            <option>Еда</option>
                            <option>Аксессуары</option>
                            <option>Игрушки</option>
                            <option>Здоровье</option>
                            <option>Гигиена</option>
                        </select>
                    </div>
                </div>

                {/* Сетка товаров */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </div>
        </main>
        
        {/* Модальное окно корзины */}
        {isCartOpen && <CartModal cart={cart} onClose={() => setIsCartOpen(false)} />}

        {/* Футер */}
        <footer className="bg-gray-800 text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
                &copy; {new Date().getFullYear()} Pet Store. Данные корзины сохраняются в браузере (localStorage).
            </div>
        </footer>
    </div>
  );
};

export default ShopPage;