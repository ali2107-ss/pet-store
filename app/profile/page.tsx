import React, { useState } from 'react';
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings } from 'lucide-react';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('orders');

    // Моковые данные пользователя
    const user = {
        name: 'Асель Айдарова',
        email: 'asel.a@example.com',
        phone: '+7 701 123 45 67',
        avatar: 'https://placehold.co/150x150/6B46C1/ffffff?text=AA'
    };

    // Моковые данные заказов
    const orders = [
        { id: '#9876', status: 'Доставлен', total: 4500, date: '10.05.2024' },
        { id: '#9875', status: 'В пути', total: 2800, date: '05.05.2024' },
        { id: '#9874', status: 'Отменен', total: 6100, date: '01.05.2024' },
    ];

    const OrderItem = ({ order }: { order: typeof orders[0] }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div>
                <p className="font-semibold text-gray-800">Заказ {order.id}</p>
                <p className="text-sm text-gray-500">Дата: {order.date}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-indigo-600">{order.total.toLocaleString()} ₸</p>
                <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                    order.status === 'Доставлен' ? 'bg-green-100 text-green-700' :
                    order.status === 'В пути' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {order.status}
                </span>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Мои заказы</h3>
                        {orders.length > 0 ? (
                            orders.map(order => <OrderItem key={order.id} order={order} />)
                        ) : (
                            <div className="text-center py-8 text-gray-500">У вас пока нет заказов.</div>
                        )}
                    </div>
                );
            case 'address':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Адреса доставки</h3>
                        <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-indigo-100">
                            <p className="font-medium text-gray-900">Основной адрес</p>
                            <p className="text-gray-600">ул. Абая, д. 120, кв. 5, Алматы</p>
                            <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">Редактировать</button>
                        </div>
                    </div>
                );
            case 'favorites':
                return (
                    <div className="text-center py-12 text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg">Список избранного пуст.</p>
                        <a href="/shop" className="text-indigo-600 hover:underline mt-2 inline-block">Перейти в магазин</a>
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Настройки профиля</h3>
                        <p className="text-gray-700">Тут будут настройки уведомлений и пароля...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'orders', icon: ShoppingBag, name: 'Мои заказы' },
        { id: 'address', icon: MapPin, name: 'Адреса' },
        { id: 'favorites', icon: Heart, name: 'Избранное' },
        { id: 'settings', icon: Settings, name: 'Настройки' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 mb-8">
                    <div className="flex items-center space-x-6">
                        <img 
                            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
                            src={user.avatar} 
                            alt={user.name} 
                            onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src="https://placehold.co/150x150/6B46C1/ffffff?text=АП"; }}
                        />
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600">{user.phone}</p>
                        </div>
                    </div>
                    <button 
                        className="mt-4 flex items-center text-red-600 hover:text-red-500 font-medium transition duration-150"
                        onClick={() => console.log('Выход из системы')}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Выйти
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Боковое меню */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
                        <nav className="space-y-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium transition duration-150 ${
                                        activeTab === item.id 
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Основной контент */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;