"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface FavoriteItem {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
}

interface FavoritesContextType {
  items: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const GUEST_KEY = 'pet_store_guest_favorites';
  const USER_KEY = 'pet_store_favorites';

  const readGuest = () => {
    try { const raw = localStorage.getItem(GUEST_KEY); return raw ? (JSON.parse(raw) as FavoriteItem[]) : []; } catch(e) { return []; }
  };
  const writeGuest = (data: FavoriteItem[]) => { try { localStorage.setItem(GUEST_KEY, JSON.stringify(data)); } catch(e) {} };
  const writeLocalUser = (data: FavoriteItem[]) => { try { localStorage.setItem(USER_KEY, JSON.stringify(data)); } catch(e) {} };

  const mergeFavs = (a: FavoriteItem[] = [], b: FavoriteItem[] = []) => {
    const map = new Map<number, FavoriteItem>();
    [...a, ...b].forEach((it) => { if (!map.has(it.id)) map.set(it.id, it); });
    return Array.from(map.values());
  };

  // init: сначала guest, затем если есть сессия — загрузить с сервера и слить
  useEffect(() => {
    let mounted = true;
    async function init() {
      const guest = readGuest();
      if (mounted) setItems(guest);
      try {
        const sessionRes = await (supabase.auth as any).getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (!token) { setIsLoaded(true); return; }

        const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setIsLoaded(true); return; }
        const json = await res.json();
        const serverItems: FavoriteItem[] = json?.items || [];
        const merged = mergeFavs(serverItems, guest);
        if (mounted) setItems(merged);
        await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ items: merged }) });
        writeLocalUser(merged);
        try { localStorage.removeItem(GUEST_KEY); } catch(e) {}
      } catch(e) {
        // ignore
      } finally { if (mounted) setIsLoaded(true); }
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      (async () => {
        if (!session?.access_token) {
          const guestNow = readGuest(); setItems(guestNow);
        } else {
          const guestNow = readGuest(); const token = session.access_token;
          try {
            const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const json = await res.json();
            const serverItems: FavoriteItem[] = json?.items || [];
            const merged = mergeFavs(serverItems, guestNow);
            setItems(merged);
            await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ items: merged }) });
            writeLocalUser(merged);
            try { localStorage.removeItem(GUEST_KEY); } catch(e) {}
          } catch(e) {}
        }
      })();
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  // save: если есть сессия — на сервер, иначе — в guest
  useEffect(() => {
    if (!isLoaded) return;
    let timeout: any = null;
    async function saveRemote() {
      try {
        const sessionRes = await (supabase.auth as any).getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (token) {
          await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ items }) });
          writeLocalUser(items);
        } else {
          writeGuest(items);
        }
      } catch(e) {}
    }
    timeout = setTimeout(saveRemote, 500);
    return () => clearTimeout(timeout);
  }, [items, isLoaded]);

  const addToFavorites = (item: FavoriteItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (!existingItem) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromFavorites = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearFavorites = () => {
    setItems([]);
  };

  const isFavorite = (id: number) => {
    return items.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ items, addToFavorites, removeFromFavorites, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}