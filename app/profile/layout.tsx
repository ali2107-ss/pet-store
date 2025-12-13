"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings, CreditCard, Package } from 'lucide-react';
import supabase from '../../lib/supabaseClient';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Ошибка получения пользователя:', error);
        } else {
          setUser(data.user ?? null);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { id: 'orders', href: '/profile/orders', icon: ShoppingBag, name: 'Мои заказы' },
    { id: 'address', href: '/profile/address', icon: MapPin, name: 'Адреса доставки' },
    { id: 'favorites', href: '/profile/favorites', icon: Heart, name: 'Избранное' },
    { id: 'cards', href: '/profile/cards', icon: CreditCard, name: 'Способы оплаты' },
    { id: 'settings', href: '/profile/settings', icon: Settings, name: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="relative">
              <img
                src={user?.user_metadata?.avatar || 'https://placehold.co/150x150/4F46E5/ffffff?text=U'}
                alt={user?.user_metadata?.full_name || user?.email || 'Аватар'}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button type="button" aria-label="Настройки профиля" title="Настройки профиля" className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.user_metadata?.full_name || user?.email || 'Гость'}</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-500 text-sm mb-4">
                <span>{user?.email}</span>
                <span className="hidden md:inline">•</span>
                <span>{user?.user_metadata?.phone}</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                {user?.created_at ? `с нами с ${new Date(user.created_at).getFullYear()} года` : ''}
              </div>
            </div>

            <button
              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                  router.push('/login');
                } catch (e) {
                  console.error('Logout error', e);
                }
              }}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Выйти</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.id} href={item.href} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 text-white text-center">
              <p className="font-bold text-lg mb-2">Premium Статус</p>
              <p className="text-indigo-100 text-sm mb-4">Получайте кэшбек 5% с каждой покупки</p>
              <button className="w-full bg-white text-indigo-600 text-sm font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                Подключить
              </button>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
