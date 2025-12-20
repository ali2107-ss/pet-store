"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';

export interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузить корзину из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem('pet_store_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Ошибка при загрузке корзины:', e);
      }
    }
    setIsLoaded(true);
  }, []);

    const GUEST_KEY = 'pet_store_guest_cart';
    const USER_KEY = 'pet_store_cart';

    // Вспомогательные функции
    const readGuest = () => {
      try {
        const raw = localStorage.getItem(GUEST_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
      } catch (e) {
        return [];
      }
    };

    const writeGuest = (data: CartItem[]) => {
      try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(data));
      } catch (e) {
        // ignore
      }
    };

    const writeLocalUser = (data: CartItem[]) => {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch (e) {
        // ignore
      }
    };

    // Мердж корзин: суммы количества по одинаковым id
    const mergeItems = (a: CartItem[] = [], b: CartItem[] = []) => {
      const map = new Map<number, CartItem>();
      [...a, ...b].forEach((it) => {
        const existing = map.get(it.id);
        if (existing) {
          map.set(it.id, { ...existing, quantity: (existing.quantity || 1) + (it.quantity || 1) });
        } else {
          map.set(it.id, { ...it, quantity: it.quantity ?? 1 });
        }
      });
      return Array.from(map.values());
    };

    // Инициализация: восстановить guest, затем если есть сессия — загрузить с сервера и слить
    useEffect(() => {
      let mounted = true;
      async function init() {
        const guest = readGuest();
        // Пока показываем гостевую корзину
        if (mounted) setItems(guest);

        try {
          const sessionRes = await (supabase.auth as any).getSession();
          const token = sessionRes?.data?.session?.access_token;
          if (!token) {
            setIsLoaded(true);
            return;
          }

          // есть сессия — загрузить корзину пользователя
          const res = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) {
            setIsLoaded(true);
            return;
          }
          const json = await res.json();
          const serverItems: CartItem[] = json?.items || [];

          // Merge guest + server
          const merged = mergeItems(serverItems, guest);
          if (mounted) setItems(merged);

          // Сохранить merged на сервер и локально для пользователя
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ items: merged }),
          });
          writeLocalUser(merged);

          // Очистим гостевую корзину
          try { localStorage.removeItem(GUEST_KEY); } catch(e) {}
        } catch (e) {
          // ignore
        } finally {
          if (mounted) setIsLoaded(true);
        }
      }
      init();
      // Подписка на изменения сессии — переключение guest <-> user
      const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
        (async () => {
          if (!session?.access_token) {
            // Вышли — показать гостевую корзину
            const guestNow = readGuest();
            setItems(guestNow);
          } else {
            // Зашли — загрузить с сервера, слить с гостем
            const guestNow = readGuest();
            const token = session.access_token;
            try {
              const res = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
              if (!res.ok) return;
              const json = await res.json();
              const serverItems: CartItem[] = json?.items || [];
              const merged = mergeItems(serverItems, guestNow);
              setItems(merged);
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ items: merged }),
              });
              writeLocalUser(merged);
              try { localStorage.removeItem(GUEST_KEY); } catch(e) {}
            } catch (e) {
              // ignore
            }
          }
        })();
      });

      return () => { mounted = false; listener.subscription.unsubscribe(); };
    }, []);

    // Сохранять корзину: если залогинен — на сервер и в USER_KEY, иначе — в GUEST_KEY
    useEffect(() => {
      if (!isLoaded) return;

      let timeout: any = null;
      async function saveRemote() {
        try {
          const sessionRes = await (supabase.auth as any).getSession();
          const token = sessionRes?.data?.session?.access_token;
          if (token) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ items }),
            });
            writeLocalUser(items);
          } else {
            writeGuest(items);
          }
        } catch (e) {
          // ignore
        }
      }

      timeout = setTimeout(saveRemote, 500);
      return () => clearTimeout(timeout);
    }, [items, isLoaded]);
  // Если пользователь авторизован — попытаться загрузить корзину из сервера
  useEffect(() => {
    let mounted = true;
    async function loadRemote() {
      try {
        const sessionRes = await (supabase.auth as any).getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (!token) return;
        const res = await fetch(`/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json?.items) {
          setItems(json.items);
        }
      } catch (e) {
        // не критично
      }
    }
    loadRemote();
    return () => { mounted = false; };
  }, []);

  // Сохранять корзину в localStorage при изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pet_store_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // При изменении корзины — синхронизировать с сервером, если есть пользователь
  useEffect(() => {
    let timeout: any = null;
    async function saveRemote() {
      try {
        const sessionRes = await (supabase.auth as any).getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (!token) return;
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items }),
        });
      } catch (e) {
        // ignore
      }
    }

    // debounce записи на сервер
    timeout = setTimeout(saveRemote, 500);
    return () => clearTimeout(timeout);
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Если товар уже в корзине, увеличиваем количество
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
