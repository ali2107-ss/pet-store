"use client";

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Настройки профиля</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
            <input id="profile-name" type="text" placeholder="Имя" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
            <input id="profile-phone" type="tel" placeholder="Телефон" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input id="profile-email" type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Смена пароля</h3>
          <div className="space-y-4">
            <input type="password" placeholder="Текущий пароль" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            <input type="password" placeholder="Новый пароль" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="button" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">Сохранить изменения</button>
        </div>
      </form>
    </div>
  );
}
