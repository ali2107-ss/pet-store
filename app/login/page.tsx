"use client";
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            if (isLogin) {
                // Вход
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                
                // Проверяем, есть ли профиль, если нет — создаём
                if (data.user) {
                    const { data: existingProfile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', data.user.id)
                        .single();

                    if (!existingProfile) {
                        // Профиля нет — создаём
                        await supabase.from('profiles').insert({
                            id: data.user.id,
                            email: data.user.email,
                            full_name: data.user.user_metadata?.full_name || data.user.email,
                        });
                    }
                }
                
                // Редирект на профиль
                router.push('/profile');
            } else {
                // Попытка регистрации через серверный endpoint (создаёт подтверждённого пользователя).
                // Если сервер не настроен (нет service role key), откатываемся на клиентский signUp.
                try {
                    const res = await fetch('/api/admin/create-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, full_name: name })
                    });

                    // Если сервер вернул 500 (misconfigured) — попробуем клиентский flow
                    if (res.status === 500) {
                        console.warn('Server signup returned 500, falling back to client signUp');
                        const { data, error } = await (supabase as any).auth.signUp({ email, password });
                        if (error) {
                            throw error;
                        }
                        setMessage('Аккаунт создан. Проверьте почту для подтверждения (если требуется).');
                        return;
                    }

                    const json = await res.json();
                    if (!res.ok) {
                        throw new Error(json.error || 'Registration failed');
                    }

                    // Успешно создан на сервере — редирект на профиль
                    router.push('/profile');
                } catch (e: any) {
                    console.error('Server signup error', e);
                    setMessage(e.message || 'Ошибка регистрации');
                }
            }
        } catch (err: any) {
            console.error('Auth error', err);
            setMessage(err.message || 'Ошибка аутентификации');
        } finally {
            setLoading(false);
        }
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
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="sr-only">Имя</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Ваше Имя"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="sr-only">Email адрес</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email адрес"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="sr-only">Пароль</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Пароль"
                            />
                        </div>
                    </div>

                    {message && <div className="text-sm text-red-600">{message}</div>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md disabled:opacity-60"
                        >
                            {loading ? 'Подождите...' : buttonText}
                            <ArrowRight className="w-5 h-5 ml-2" />
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