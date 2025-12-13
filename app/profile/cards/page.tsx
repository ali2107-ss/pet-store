"use client";

import React from 'react';
import { CreditCard } from 'lucide-react';

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Способы оплаты</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <div>
              <div className="font-medium">Visa **** 4242</div>
              <div className="text-sm text-gray-500">Срок действия 12/26</div>
            </div>
          </div>
          <div className="text-sm text-indigo-600">Удалить</div>
        </div>

        <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-gray-50 transition-all">
          Добавить новую карту
        </button>
      </div>
    </div>
  );
}
