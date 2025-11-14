"use client";
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

const AuthPage = () => {
    // Состояние для переключения между Входом (true) и Регистрацией (false)
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isLogin ? 'Вход' : 'Регистрация';
        console.log(`${action} нажата`);
        // Здесь в будущем будет логика для аутентификации
    };

    const title = isLogin ? 'Вход в аккаунт' : 'Создать аккаунт';
    const buttonText = isLogin ? 'Войти' : 'Зарегистрироваться';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">
                <div className="text-center">
                    <User className="w-12 h-12 mx-auto text-indigo-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Поле имени - только для регистрации */}
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="sr-only">Имя</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                    placeholder="Ваше Имя"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Поле Email */}
                    <div>
                        <label htmlFor="email" className="sr-only">Email адрес</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Email адрес"
                            />
                        </div>
                    </div>
                    
                    {/* Поле Пароль */}
                    <div>
                        <label htmlFor="password" className="sr-only">Пароль</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                                placeholder="Пароль"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md"
                        >
                            {buttonText}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition duration-150" />
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
                    >
                        {isLogin 
                            ? "Нет аккаунта? Зарегистрироваться" 
                            : "Уже есть аккаунт? Войти"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
