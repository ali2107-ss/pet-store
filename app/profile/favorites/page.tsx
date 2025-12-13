"use client";

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';

export default function FavoritesPage() {
  const { items, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Избранное</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">У вас пока нет избранных товаров.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image.startsWith('http') ? item.image : `/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/400x300/E5E7EB/4B5563?text=Нет+Фото"; }}
                />
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 hover:text-red-600 transition transform hover:scale-110"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-indigo-600 mb-1 uppercase">{item.category}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex-grow">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <p className="text-2xl font-extrabold text-indigo-700">{item.price} ₸</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-150 shadow-lg shadow-green-300/50 transform hover:translate-y-[-1px] bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
