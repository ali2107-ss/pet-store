"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

interface Order {
  id: number;
  date: string;
  items: Array<{ title: string; price: string; image: string; category: string }>;
  total: number;
  delivery: { city: string; address: string; apartment: string; phone: string; paymentMethod: string };
  status: string;
}

const OrderItem = ({ order }: { order: Order }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 mb-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-gray-900">Заказ #{order.id}</span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            order.status === 'Завершён' ? 'bg-green-100 text-green-800' :
            order.status === 'В пути' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">От {order.date}</p>
      </div>
      <p className="text-xl font-bold text-indigo-600 mt-2 sm:mt-0">{order.total.toLocaleString()} ₸</p>
    </div>

    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <p className="text-sm text-gray-700 font-medium mb-3">Животные в заказе:</p>
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover" />
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <p className="text-sm text-gray-600 mb-2"><strong>Адрес доставки:</strong></p>
      <p className="text-sm text-gray-800">
        {order.delivery.city}, {order.delivery.address}
        {order.delivery.apartment ? `, ${order.delivery.apartment}` : ''}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        <strong>Телефон:</strong> {order.delivery.phone}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Способ оплаты:</strong> {order.delivery.paymentMethod === 'card' ? 'Карточка' : 'Наличные'}
      </p>
    </div>
  </div>
);

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка при загрузке заказов:', e);
      }
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">История заказов</h2>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{orders.length} заказов</span>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : orders.length > 0 ? (
        <div>
          {orders.map(order => <OrderItem key={order.id} order={order} />)}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">У вас пока нет заказов.</p>
          <Link href="/animals">
            <button className="text-indigo-600 font-medium hover:underline">Перейти в каталог животных</button>
          </Link>
        </div>
      )}
    </div>
  );
}
