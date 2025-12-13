import React from 'react';
import ShopClient from './ShopClient';

// Server Component: загружаем данные с API при рендере на сервере
async function fetchProducts() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/shop`, {
      cache: 'no-store', // или 'force-cache' для кэширования
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.status);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ShopPage() {
  const initialProducts = await fetchProducts();

  return <ShopClient initialProducts={initialProducts} />;
}