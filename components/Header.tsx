"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient";

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
          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
            {/* Иконка корзины */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Счетчик товаров */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
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
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                Выйти
              </button>
            )
          )}
        </div>

      </nav>
    </header>
  );
}
