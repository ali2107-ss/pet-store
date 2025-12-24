"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Address {
  id: number;
  user_id: string;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_default: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Казахстан',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAddresses([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      if (formData.is_default) {
        await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
      }

      if (editingAddress) {
        const { error } = await supabase
          .from('user_addresses')
          .update({
            name: formData.name,
            address: formData.address,
            city: formData.city || null,
            postal_code: formData.postal_code || null,
            country: formData.country || null,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            name: formData.name,
            address: formData.address,
            city: formData.city || null,
            postal_code: formData.postal_code || null,
            country: formData.country || 'Казахстан',
            is_default: formData.is_default,
          });

        if (error) throw error;
      }

      await fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
      setFormData({ name: '', address: '', city: '', postal_code: '', country: 'Казахстан', is_default: false });
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Ошибка при сохранении адреса');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city || '',
      postal_code: address.postal_code || '',
      country: address.country || 'Казахстан',
      is_default: address.is_default,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот адрес?')) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Unauthorized');

      const { error } = await supabase.from('user_addresses').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Ошибка при удалении адреса');
    }
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormData({ name: '', address: '', city: '', postal_code: '', country: 'Казахстан', is_default: false });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Адреса доставки</h2>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{editingAddress ? 'Изменить адрес' : 'Добавить новый адрес'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Название</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" placeholder="Например: Дом, Работа" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Адрес</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" rows={3} placeholder="Полный адрес доставки" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Город</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Почтовый индекс</label>
                <input type="text" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400" />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="is_default" checked={formData.is_default} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">Сделать основным адресом</label>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">{editingAddress ? 'Сохранить' : 'Добавить'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Отмена</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className={`border rounded-xl p-6 relative ${address.is_default ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
            {address.is_default && <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Основной</div>}
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{address.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                {(address.city || address.postal_code) && <p className="text-gray-500 text-xs mt-1">{address.city && `${address.city}, `}{address.postal_code}</p>}
              </div>
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <button onClick={() => handleEdit(address)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Edit className="w-4 h-4" />Изменить</button>
              <button onClick={() => handleDelete(address.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-4 h-4" />Удалить</button>
            </div>
          </div>
        ))}

        <button onClick={openAddForm} className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-gray-50 transition-all h-full min-h-[160px]">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3"><Plus className="w-6 h-6" /></div>
          <span className="font-medium">Добавить новый адрес</span>
        </button>
      </div>
    </div>
  );
}
