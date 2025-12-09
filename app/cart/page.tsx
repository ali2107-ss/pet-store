"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCart();

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num) + ' ₸';
  };

  const handleCheckout = () => {
    // Переходим на страницу доставки
    router.push('/delivery');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/animals" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад к животным
          </Link>

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-8">Добавьте животных из каталога, чтобы начать покупки</p>
            <Link href="/animals">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Вернуться в каталог
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/animals" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад к животным
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Изображение */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Информация */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Категория: {item.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-indigo-600">{item.price}</span>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-sm text-gray-500">× {item.quantity}</span>
                      )}
                    </div>
                  </div>

                  {/* Кнопка удаления */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить из корзины"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Сумма и действия */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Товаров:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Сумма:</span>
                  <span className="text-indigo-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors mb-3"
              >
                Оформить заказ
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}