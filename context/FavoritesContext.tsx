'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Загрузить избранное из localStorage при монтировании
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pet_store_favorites');
    if (savedFavorites) {
      try {
        setItems(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Ошибка при загрузке избранного:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Сохранять избранное в localStorage при изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pet_store_favorites', JSON.stringify(items));
    }
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