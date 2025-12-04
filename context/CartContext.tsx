"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Тип товара
export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  // legacy / convenience alias used by some components
  items: CartItem[];
  addToCart: (product: CartItem | any) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const savedCart = localStorage.getItem('petPalaceCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('petPalaceCart', JSON.stringify(cartItems));
    } catch {
      // ignore localStorage errors
    }
  }, [cartItems]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.name === product.name
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      let price = product.price;
      if (typeof product.price === 'string') {
        price = parseInt(product.price.replace(/\D/g, ''), 10) || 0;
      }

      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        quantity: product.quantity || 1,
        category: product.category,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, items: cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
