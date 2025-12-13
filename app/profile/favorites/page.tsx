"use client";

import React from 'react';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Избранное</h2>
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">У вас пока нет избранных товаров.</p>
      </div>
    </div>
  );
}
