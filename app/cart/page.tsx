import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

// Моковые данные о товарах в корзине (пустая заглушка)
const cartItems = []; 

const CartItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-150 border border-gray-100">
        {/* Детали товара */}
    </div>
);

const CartSummary = ({ total }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Итог заказа</h2>
        
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
    // Если корзина пуста, показываем сообщение
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
    
    // Этот код пока не будет использоваться, пока cartItems пуст
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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