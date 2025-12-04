"use client";
import React, { useState } from 'react';
import { User, Phone, MapPin, PawPrint, CheckCircle, AlertTriangle, Loader, Send } from 'lucide-react';

// ИМПОРТЫ FIREBASE УДАЛЕНЫ
// Глобальные переменные, предоставленные средой Canvas (оставлены, но не используются)
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

function ApplicationForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Переменные состояния Firebase и Auth удалены или упрощены
    const isAuthReady = true; // Считаем систему готовой, так как нет зависимостей
    const userId = 'GUEST_USER_ID_NO_DB'; // Заглушка для ID пользователя

    // --- 1. Инициализация Firebase, Аутентификация и Firestore ---
    // useEffect hook для инициализации Firebase УДАЛЕН

    // --- 2. Обработка отправки заявки (теперь без Firestore) ---
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        
        setIsLoading(true);
        setMessage(null);

        // Формирование данных заявки
        const applicationData = {
            name: name.trim(),
            phone: phone.trim(),
            city: city.trim(),
            // Эти поля теперь не актуальны без реальной базы данных
            submittedBy: userId, 
            timestamp: new Date().toISOString(),
            status: 'Placeholder', 
        };

        try {
            // Эмуляция отправки данных в базу данных (теперь просто вывод в консоль)
            console.log("--- Заявка отправлена (PLACEHOLDER) ---");
            console.log(JSON.stringify(applicationData, null, 2));
            console.log("---------------------------------------");
            
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 800)); 

            setMessage({ type: 'success', text: 'Ваша заявка успешно отправлена! (Данные сохранены в консоли)' });
            
            // Очистка полей
            setName('');
            setPhone('');
            setCity('');
        } catch (error) {
            // В этом упрощенном коде ошибки маловероятны, но мы оставим обработчик
            console.error("Failed to submit application (Placeholder error):", error);
            setMessage({ type: 'error', text: 'Не удалось отправить заявку. Произошла внутренняя ошибка.' });
        } finally {
            setIsLoading(false);
        }
    };

    const title = 'Оставить заявку на поиск животного';
    const buttonText = 'Отправить заявку';

    return (
        <div className="min-h-screen bg-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-indigo-600">
                <div className="text-center">
                    <PawPrint className="w-12 h-12 mx-auto text-indigo-600 mb-2" />
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Оставьте свои данные, и наш сотрудник свяжется с вами, чтобы обсудить детали поиска животного.
                    </p>
                </div>

                {/* Сообщение об ошибке/успехе */}
                {message && (
                    <div 
                        className={`p-4 rounded-lg flex items-center ${
                            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                    >
                        {message.type === 'error' ? <AlertTriangle className="w-5 h-5 mr-3" /> : <CheckCircle className="w-5 h-5 mr-3" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}
                
                {/* Форма */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Поле Имя */}
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Ваше Имя</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Например, Иван"
                                disabled={isLoading || !isAuthReady}
                            />
                        </div>
                    </div>

                    {/* Поле Номер телефона */}
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">Номер телефона</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="+7 (XXX) XXX XX XX"
                                disabled={isLoading || !isAuthReady}
                            />
                        </div>
                    </div>
                    
                    {/* Поле Город */}
                    <div>
                        <label htmlFor="city" className="text-sm font-medium text-gray-700 block mb-1">Город</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="city"
                                name="city"
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Ваш город"
                                disabled={isLoading || !isAuthReady}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !isAuthReady}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md disabled:opacity-50"
                        >
                            {isLoading || !isAuthReady ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    {buttonText}
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {/* Отображение userId для отладки */}
                <p className="text-xs text-gray-400 mt-4 break-words">
                    ID пользователя: {userId}
                </p>
            </div>
        </div>
    );
}

export default ApplicationForm;