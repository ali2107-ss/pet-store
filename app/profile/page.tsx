"use client";

import React, { useState } from 'react';
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings, CreditCard, Package } from 'lucide-react';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('orders');

    // Моковые данные пользователя
    const user = {
        name: 'Идаят Али',
        email: 'ali2107idai@gmail.com',
        phone: '+7 778 648 2899',
        avatar: 'https://placehold.co/150x150/4F46E5/ffffff?text=AP',
        joinDate: 'с нами с 2025 года'
    };

    // Моковые данные заказов
    const orders = [
        { id: '#ORD-9876', status: 'Доставлен', total: 14500, date: '10.05.2025', items: ['Корм ProPlan (10кг)', 'Игрушка Kong'] },
        { id: '#ORD-9875', status: 'В пути', total: 2800, date: '20.09.2025', items: ['Витамины для шерсти'] },
        { id: '#ORD-9874', status: 'Обработка', total: 6100, date: '21.10.2025', items: ['Лежанка Soft', 'Миска керамическая'] },
    ];

    // Компонент для отображения одного заказа
    const OrderItem = ({ order }: { order: any }) => (
        <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-gray-900">{order.id}</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            order.status === 'Доставлен' ? 'bg-green-100 text-green-800' :
                            order.status === 'В пути' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">От {order.date}</p>
                </div>
                <p className="text-xl font-bold text-indigo-600 mt-2 sm:mt-0">{order.total.toLocaleString()} ₸</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">Состав заказа:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {order.items.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-4 flex justify-end">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    Повторить заказ
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">История заказов</h2>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {orders.length} заказов
                            </span>
                        </div>
                        {orders.length > 0 ? (
                            orders.map(order => <OrderItem key={order.id} order={order} />)
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">У вас пока нет заказов.</p>
                                <button className="mt-4 text-indigo-600 font-medium hover:underline">Перейти в каталог</button>
                            </div>
                        )}
                    </div>
                );
            case 'address':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Адреса доставки</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-6 relative">
                                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Основной</div>
                                <div className="flex items-start gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Дом</h3>
                                        <p className="text-gray-600 text-sm mt-1">г. Атырау, проезд. Автомобилистов 1,</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-800">Изменить</button>
                                    <button className="text-red-500 hover:text-red-700">Удалить</button>
                                </div>
                            </div>
                            
                            <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-gray-50 transition-all h-full min-h-[160px]">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100">
                                    <span className="text-2xl leading-none mb-1">+</span>
                                </div>
                                <span className="font-medium">Добавить новый адрес</span>
                            </button>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки профиля</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                                    <input id="profile-name" type="text" defaultValue={user.name} placeholder="Имя" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                                    <input id="profile-phone" type="tel" defaultValue={user.phone} placeholder="Телефон" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input id="profile-email" type="email" defaultValue={user.email} placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Смена пароля</h3>
                                <div className="space-y-4">
                                    <input type="password" placeholder="Текущий пароль" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                    <input type="password" placeholder="Новый пароль" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="button" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                    Сохранить изменения
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'orders', icon: ShoppingBag, name: 'Мои заказы' },
        { id: 'address', icon: MapPin, name: 'Адреса доставки' },
        { id: 'favorites', icon: Heart, name: 'Избранное' },
        { id: 'cards', icon: CreditCard, name: 'Способы оплаты' },
        { id: 'settings', icon: Settings, name: 'Настройки' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Шапка профиля */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        <div className="relative">
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <button type="button" aria-label="Настройки профиля" title="Настройки профиля" className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-500 text-sm mb-4">
                                <span>{user.email}</span>
                                <span className="hidden md:inline">•</span>
                                <span>{user.phone}</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                                {user.joinDate}
                            </div>
                        </div>

                        <button 
                            className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                            onClick={() => console.log('Logout')}
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            <span className="font-medium">Выйти</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Боковая навигация */}
                    <div className="lg:col-span-3">
                        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        activeTab === item.id 
                                            ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span>{item.name}</span>
                                    {item.id === 'orders' && (
                                        <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                            3
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                        
                        {/* Баннер в сайдбаре */}
                        <div className="mt-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 text-white text-center">
                            <p className="font-bold text-lg mb-2">Premium Статус</p>
                            <p className="text-indigo-100 text-sm mb-4">Получайте кэшбек 5% с каждой покупки</p>
                            <button className="w-full bg-white text-indigo-600 text-sm font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                Подключить
                            </button>
                        </div>
                    </div>

                    {/* Основной контент */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;