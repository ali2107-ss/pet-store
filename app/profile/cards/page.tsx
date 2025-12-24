"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface PaymentMethod {
  id: number;
  type: string;
  card_number_masked: string;
  card_brand: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export default function CardsPage() {
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    card_brand: '',
    is_default: false,
  });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setCards([]);

      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      if (!editingCard && !formData.card_number) {
        alert('Введите номер карты');
        return;
      }

      if (formData.is_default) {
        await supabase.from('user_payment_methods').update({ is_default: false }).eq('user_id', user.id);
      }

      if (editingCard) {
        const updateData: any = {
          expiry_month: Number(formData.expiry_month) || editingCard.expiry_month,
          expiry_year: Number(formData.expiry_year) || editingCard.expiry_year,
          card_brand: formData.card_brand || editingCard.card_brand,
          is_default: formData.is_default,
          updated_at: new Date().toISOString(),
        };

        if (formData.card_number) updateData.card_number_masked = `****${formData.card_number.slice(-4)}`;

        const { error } = await supabase.from('user_payment_methods').update(updateData).eq('id', editingCard.id).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_payment_methods').insert({
          user_id: user.id,
          type: 'card',
          card_number_masked: `****${formData.card_number.slice(-4)}`,
          card_brand: formData.card_brand || 'Unknown',
          expiry_month: Number(formData.expiry_month),
          expiry_year: Number(formData.expiry_year),
          is_default: formData.is_default,
        });

        if (error) throw error;
      }

      await fetchCards();
      setShowForm(false);
      setEditingCard(null);
      setFormData({ card_number: '', expiry_month: '', expiry_year: '', card_brand: '', is_default: false });
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Ошибка при сохранении карты');
    }
  };

  const handleEdit = (card: PaymentMethod) => {
    setEditingCard(card);
    setFormData({ card_number: '', expiry_month: String(card.expiry_month), expiry_year: String(card.expiry_year), card_brand: card.card_brand, is_default: card.is_default });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту карту?')) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { error } = await supabase.from('user_payment_methods').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      await fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Ошибка при удалении карты');
    }
  };

  const openAddForm = () => {
    setEditingCard(null);
    setFormData({ card_number: '', expiry_month: '', expiry_year: '', card_brand: '', is_default: false });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Способы оплаты</h2>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{editingCard ? 'Изменить карту' : 'Добавить новую карту'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Номер карты</label>
              <input type="text" value={formData.card_number} onChange={(e) => setFormData({ ...formData, card_number: e.target.value.replace(/\s/g, '') })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" placeholder="1234 5678 9012 3456" maxLength={19} required={!editingCard} />
              {editingCard && <p className="text-sm text-gray-700 mt-1">Оставьте пустым, чтобы не изменять номер</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Месяц</label>
                <select value={formData.expiry_month} onChange={(e) => setFormData({ ...formData, expiry_month: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" required>
                  <option value="">Месяц</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Год</label>
                <select value={formData.expiry_year} onChange={(e) => setFormData({ ...formData, expiry_year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" required>
                  <option value="">Год</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={String(new Date().getFullYear() + i)}>{new Date().getFullYear() + i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Банк/Тип карты</label>
              <select value={formData.card_brand} onChange={(e) => setFormData({ ...formData, card_brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900">
                <option value="">Выберите тип</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Mir">Мир</option>
                <option value="Other">Другая</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="is_default_card" checked={formData.is_default} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="is_default_card" className="ml-2 block text-sm text-gray-900">Сделать основной картой</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">{editingCard ? 'Сохранить' : 'Добавить'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Отмена</button>
            </div>
          </form>
        </div>
      )}

        <div className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <div key={card.id} className={`border rounded-xl p-4 flex items-center justify-between ${card.is_default ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <div>
                <div className="font-medium text-gray-900">{card.card_brand} {card.card_number_masked}</div>
                <div className="text-sm text-gray-700">Срок действия {String(card.expiry_month).padStart(2, '0')}/{card.expiry_year}{card.is_default && <span className="ml-2 text-indigo-600 font-medium">(Основная)</span>}</div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => handleEdit(card)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Edit className="w-4 h-4" />Изменить</button>
              <button onClick={() => handleDelete(card.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" />Удалить</button>
            </div>
          </div>
        ))}

        <button onClick={openAddForm} className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-gray-50 transition-all">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3"><Plus className="w-6 h-6" /></div>
          <span className="font-medium">Добавить новую карту</span>
        </button>
      </div>
    </div>
  );
}
