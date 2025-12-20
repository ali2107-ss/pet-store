"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import supabase from '@/lib/supabaseClient';

export interface OrderItem {
  id?: number;
  product_id?: number;
  title: string;
  price: number;
  quantity: number;
  meta?: any;
}

export interface Order {
  id?: number;
  user_id?: string;
  items: OrderItem[];
  total: number;
  meta?: any;
  created_at?: string;
}

interface OrdersContextType {
  guestOrders: Order[];
  serverOrders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'created_at'>) => Promise<Order | null>;
  getCurrentOrders: () => Order[];
  isLoaded: boolean;
  clearGuestOrders: () => void;
  clearServerOrders: () => Promise<{ ok: boolean; message?: string }>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [guestOrders, setGuestOrders] = useState<Order[]>([]);
  const [serverOrders, setServerOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const GUEST_KEY = 'pet_store_guest_orders';

  const readGuest = (): Order[] => {
    try { const raw = localStorage.getItem(GUEST_KEY); return raw ? JSON.parse(raw) as Order[] : []; } catch(e) { return []; }
  };
  const writeGuest = (data: Order[]) => { try { localStorage.setItem(GUEST_KEY, JSON.stringify(data)); } catch(e) {} };

  const clearGuestOrders = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_KEY);
      // удаляем также старый ключ, если он остался
      localStorage.removeItem('orders');
    } catch (e) {}
    setGuestOrders([]);
  }, []);

  const clearServerOrders = useCallback(async () => {
    try {
      const sessionRes = await (supabase.auth as any).getSession();
      const token = sessionRes?.data?.session?.access_token;
      if (!token) return { ok: false, message: 'no token' };
      const res = await fetch('/api/orders', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        // unauthorized — make sure client signs out
        try { await (supabase.auth as any).signOut(); } catch (e) {}
        return { ok: false, message: 'unauthorized' };
      }
      if (!res.ok) {
        const text = await res.text().catch(() => 'unknown');
        console.error('Failed to clear server orders', text);
        return { ok: false, message: text };
      }
      setServerOrders([]);
      return { ok: true };
    } catch (e: any) {
      console.error('clearServerOrders', e);
      return { ok: false, message: e?.message || 'error' };
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      const guest = readGuest();
      if (mounted) setGuestOrders(guest);

      try {
        const sessionRes = await (supabase.auth as any).getSession();
        const token = sessionRes?.data?.session?.access_token;
        if (!token) { setIsLoaded(true); return; }

        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { setIsLoaded(true); return; }
        const json = await res.json();
        if (mounted) setServerOrders(json?.orders || []);
      } catch(e) {
        // ignore
      } finally { if (mounted) setIsLoaded(true); }
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      (async () => {
        if (!session?.access_token) {
          // logged out -> keep guest orders
          setServerOrders([]);
        } else {
          // logged in -> fetch server orders (do not merge)
          const token = session.access_token;
          try {
            const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const json = await res.json();
            setServerOrders(json?.orders || []);
          } catch(e) {}
        }
      })();
    });

    return () => { listener.subscription.unsubscribe(); mounted = false; };
  }, []);

  const createOrder = async (order: Omit<Order, 'id' | 'created_at'>) => {
    try {
      const sessionRes = await (supabase.auth as any).getSession();
      const token = sessionRes?.data?.session?.access_token;
      if (token) {
        const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(order) });
        if (!res.ok) return null;
        const json = await res.json();
        const created: Order = json?.order;
        setServerOrders(prev => [created, ...prev]);
        return created;
      } else {
        // guest: save locally
        const guest = readGuest();
        const newOrder: Order = { ...order, id: Date.now(), created_at: new Date().toISOString() } as Order;
        const updated = [newOrder, ...guest];
        writeGuest(updated);
        setGuestOrders(updated);
        return newOrder;
      }
    } catch(e) {
      return null;
    }
  };

  const getCurrentOrders = () => {
    const session = (supabase.auth as any).getSession?.();
    // can't synchronously determine session easily; prefer serverOrders if non-empty
    return serverOrders.length > 0 ? serverOrders : guestOrders;
  };

  return (
    <OrdersContext.Provider value={{ guestOrders, serverOrders, createOrder, getCurrentOrders, isLoaded, clearGuestOrders, clearServerOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
