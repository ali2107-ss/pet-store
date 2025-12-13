"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

export default function AddressPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Адреса доставки</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-indigo-200 bg-indigo-50 rounded-xl p-6 relative">
          <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Основной</div>
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Дом</h3>
              <p className="text-gray-600 text-sm mt-1">г. Атырау, проезд. Автомобилистов 1,</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <button className="text-indigo-600 hover:text-indigo-800">Изменить</button>
            <button className="text-red-500 hover:text-red-700">Удалить</button>
          </div>
        </div>

        <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-gray-50 transition-all h-full min-h-[160px]">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl leading-none mb-1">+</span>
          </div>
          <span className="font-medium">Добавить новый адрес</span>
        </button>
      </div>
    </div>
  );
}
