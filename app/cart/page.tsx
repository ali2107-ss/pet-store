"use client";

import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

// Моковые данные о товарах в корзине
const cartItems = [
    { id: 1, name: 'Сухой корм для кошек (2 кг)', price: 1500, quantity: 1, image: 'https://placehold.co/100x100/A0B2C0/ffffff?text=Корм' },
    { id: 2, name: 'Игрушка "Мышка"', price: 200, quantity: 3, image: 'https://placehold.co/100x100/C0A0B2/ffffff?text=Мышка' },
    { id: 3, name: 'Миска двойная', price: 1200, quantity: 1, image: 'https://placehold.co/100x100/B2C0A0/ffffff?text=Миска' },
];

const CartItem = ({ item }: { item: any }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-150 border border-gray-100">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
            <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="min-w-0">
                <p className="text-lg font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} ₸ / шт.</p>
            </div>
        </div>

        <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg">
                    <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-lg font-medium text-gray-800">{item.quantity}</span>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            
            <p className="text-xl font-bold text-indigo-600 w-24 text-right hidden sm:block">
                {(item.price * item.quantity).toLocaleString()} ₸
            </p>

            <button className="p-3 text-red-500 hover:bg-red-100 rounded-full transition duration-150">
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const CartSummary = ({ total }: { total: number }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Итог заказа</h2>
        
        <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
                <span>Промежуточный итог:</span>
                <span>{total.toLocaleString()} ₸</span>
            </div>
            <div className="flex justify-between text-gray-600">
                <span>Доставка:</span>
                <span className="text-green-600">Бесплатно</span>
            </div>
        </div>
        
        <div className="flex justify-between text-2xl font-extrabold text-gray-900 border-t pt-4">
            <span>Итого к оплате:</span>
            <span>{total.toLocaleString()} ₸</span>
        </div>

        <a 
            href="/delivery"
            className="mt-6 w-full flex items-center justify-center bg-indigo-600 text-white p-4 rounded-lg text-xl font-semibold hover:bg-indigo-700 transition duration-150 shadow-indigo-500/50 shadow-lg"
        >
            <ShoppingBag className="w-6 h-6 mr-2" />
            Оформить заказ
        </a>
    </div>
);

const CartPage = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Корзина пуста</h1>
                    <p className="text-gray-500 mb-6">Добавьте товары из нашего каталога!</p>
                    <a href="/shop" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150">
                        Перейти в магазин
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Ваша Корзина ({cartItems.length})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    
                    <div className="lg:col-span-1">
                        <CartSummary total={subtotal} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;