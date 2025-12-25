"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущую сессию
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Подписка на изменения авторизации
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;
  const { getTotalItems } = useCart();
  const { items: favItems } = useFavorites();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* ЛОГОТИП */}
        <Link href="/" className="text-3xl font-bold text-indigo-600">
          PetPalace
        </Link>

        {/* НАВИГАЦИЯ */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-gray-600 hover:text-indigo-600">Главная</Link>
          <Link href="/shop" className="text-gray-600 hover:text-indigo-600">Магазин</Link>
          <Link href="/reviews" className="text-gray-600 hover:text-indigo-600">Отзывы</Link>
          <Link href="/location" className="text-gray-600 hover:text-indigo-600">Контакты</Link>
          <Link href="/animals" className="text-gray-600 hover:text-indigo-600">Животные</Link>
          {user && (
            <Link href="/profile" className="text-gray-600 hover:text-indigo-600">Профиль</Link>
          )}
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center space-x-4">
          {/* Корзина — ведёт на страницу /cart */}
          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{getTotalItems()}</span>
          </Link>

          {/* Избранное — ведёт в профиль/избранное */}
          <Link href="/profile/favorites" className="relative text-gray-600 hover:text-red-500 transition-colors">
            {/* Сердечко */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.1 21.35l-1.1-1.02C5.14 15.24 2 12.39 2 8.99 2 6.21 4.21 4 7 4c1.66 0 3.04.81 4 2.09C12.96 4.81 14.34 4 16 4c2.79 0 5 2.21 5 4.99 0 3.4-3.14 6.25-8.99 11.34l-1.91 1.03z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{favItems.length}</span>
          </Link>

          {!loading && (
            !user ? (
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Войти
              </Link>
            ) : (
              <div className="flex items-center">
                {/* Аватар (голова и плечи) — кликабелен и ведёт в профиль */}
                <Link href="/profile" title={user.email || 'Профиль'} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.2 0-9.6 1.6-9.6 4.9V22h19.2v-2.9c0-3.3-6.4-4.9-9.6-4.9z" />
                  </svg>
                </Link>
              </div>
            )
          )}
        </div>

      </nav>
    </header>
  );
}
