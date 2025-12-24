"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import supabase from '@/lib/supabaseClient';

interface DeliveryData {
  city: string;
  address: string;
  apartment: string;
  phone: string;
  paymentMethod: 'card' | 'cash' | '';
}

interface UserAddress {
  id: number;
  city: string;
  address: string;
  apartment?: string | null;
  phone: string;
  is_default?: boolean;
}

interface PaymentMethod {
  id: number;
  brand?: string | null;
  card_number_masked?: string | null;
  is_default?: boolean;
}

const DeliveryPaymentPage = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DeliveryData>({
    city: '',
    address: '',
    apartment: '',
    phone: '',
    paymentMethod: '',
  });
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем сохранённые данные при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('delivery_data');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка при загрузке данных:', e);
      }
    }
    // Загрузим сохранённые адреса и карты из Supabase (если настроен)
    (async () => {
      try {
        const { data: addrs } = await supabase.from('user_addresses').select('*').order('is_default', { ascending: false });
        if (addrs) setAddresses(addrs as UserAddress[]);
      } catch (e) {
        console.warn('Не удалось загрузить адреса:', e);
      }
      try {
        const { data: cards } = await supabase.from('user_payment_methods').select('*').order('is_default', { ascending: false });
        if (cards) setPaymentMethods(cards as PaymentMethod[]);
      } catch (e) {
        console.warn('Не удалось загрузить карты:', e);
      }
    })();
  }, []);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('delivery_data', JSON.stringify(formData));
  }, [formData]);

  // Если выбран сохранённый адрес — подставляем значения в форму
  useEffect(() => {
    if (selectedAddressId) {
      const a = addresses.find(x => x.id === selectedAddressId);
      if (a) {
        setFormData(prev => ({
          ...prev,
          city: a.city || prev.city,
          address: a.address || prev.address,
          apartment: a.apartment || prev.apartment,
          phone: a.phone || prev.phone,
        }));
      }
    }
  }, [selectedAddressId, addresses]);

  const steps = [
    { name: 'Адрес', icon: MapPin },
    { name: 'Оплата', icon: CreditCard },
    { name: 'Подтверждение', icon: CheckCircle },
  ];

  const handleInputChange = (field: keyof DeliveryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Валидация шага 1
    if (step === 1) {
      if (useSavedAddress) {
        if (!selectedAddressId) {
          alert('Пожалуйста, выберите сохранённый адрес');
          return;
        }
      } else {
        if (!formData.city || !formData.address || !formData.phone) {
          alert('Пожалуйста, заполните все поля');
          return;
        }
      }
    }
    // Валидация шага 2
    if (step === 2) {
      if (!formData.paymentMethod) {
        alert('Пожалуйста, выберите способ оплаты');
        return;
      }
      if (formData.paymentMethod === 'card' && !selectedPaymentId) {
        alert('Пожалуйста, выберите сохранённую карту или добавьте новую в профиле');
        return;
      }
      handlePayment();
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Сохраняем заказ в историю
      const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        items: items,
        total: getTotalPrice(),
        delivery: formData,
        addressId: selectedAddressId,
        paymentMethodId: selectedPaymentId,
        paymentMethodLabel: formData.paymentMethod === 'card' && selectedPaymentId
          ? (() => { const pm = paymentMethods.find(p => p.id === selectedPaymentId); return pm ? `${pm.brand || 'Карта'} ${pm.card_number_masked || '••••'}` : 'Карточка'; })()
          : (formData.paymentMethod === 'card' ? 'Карточка' : 'Наличные'),
        status: 'Завершён',
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Очищаем корзину
      clearCart();
      localStorage.removeItem('delivery_data');

      // Переходим на шаг 3 (успех)
      setStep(3);
    } catch (err) {
      console.error('Ошибка при оплате:', err);
      alert('Ошибка при обработке платежа');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num) + ' ₸';
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-indigo-600" />
              Шаг 1: Адрес доставки
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center text-sm text-gray-800">
                  <input
                    type="radio"
                    name="address_mode"
                    checked={!useSavedAddress}
                    onChange={() => setUseSavedAddress(false)}
                    className="mr-2"
                  />
                  Ввести адрес вручную
                </label>
                <label className="inline-flex items-center text-sm text-gray-800">
                  <input
                    type="radio"
                    name="address_mode"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                    className="mr-2"
                  />
                  Выбрать сохранённый адрес
                </label>
              </div>

              {useSavedAddress && (
                <div className="space-y-2">
                  {addresses.length === 0 && (
                    <p className="text-sm text-gray-600">У вас нет сохранённых адресов в профиле.</p>
                  )}
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                        selectedAddressId === a.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved_address"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="w-5 h-5"
                      />
                      <div className="ml-3 text-sm">
                        <div className="font-medium text-gray-900">{a.city}, {a.address}{a.apartment ? `, ${a.apartment}` : ''}</div>
                        <div className="text-gray-700">{a.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!useSavedAddress && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Город *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Введите ваш город"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Улица и дом *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Улица, дом"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Квартира / подъезд</label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      placeholder="Квартира, офис (опционально)"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+7 (700) 000-00-00"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150"
            >
              Перейти к оплате
            </button>

            <Link href="/cart">
              <button className="w-full text-indigo-600 hover:text-indigo-500 font-medium py-2 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Вернуться в корзину
              </button>
            </Link>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-indigo-600" />
              Шаг 2: Способ оплаты
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Сумма к оплате:</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{formatPrice(getTotalPrice())}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-gray-800">Выберите способ оплаты:</p>

              {paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((pm) => (
                  <label key={pm.id} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedPaymentId === pm.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value={`card_${pm.id}`}
                      checked={selectedPaymentId === pm.id && formData.paymentMethod === 'card'}
                      onChange={() => {
                        setSelectedPaymentId(pm.id);
                        handleInputChange('paymentMethod', 'card');
                      }}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">💳 {pm.brand ? pm.brand : 'Карта'} {pm.card_number_masked ? pm.card_number_masked : '••••'}</p>
                      <p className="text-sm text-gray-700">{pm.is_default ? 'По умолчанию' : 'Сохранённая карта'}</p>
                    </div>
                  </label>
                ))
              ) : (
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">💳 Оплата карточкой</p>
                    <p className="text-sm text-gray-700">Visa, MasterCard, Kaspi</p>
                  </div>
                </label>
              )}

              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                formData.paymentMethod === 'cash'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-5 h-5 text-indigo-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">💵 Наличными при получении</p>
                  <p className="text-sm text-gray-600">Оплата при доставке</p>
                </div>
              </label>
            </div>

            <button
              onClick={handleNextStep}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Обработка платежа...' : 'Продолжить оплату'}
            </button>

            <button
              type="button"
              onClick={handlePrevStep}
              className="w-full text-indigo-600 hover:text-indigo-500 font-medium py-2"
            >
              Назад к адресу
            </button>
          </div>
        );

      case 3:
        return (
          <div className="text-center p-8 bg-white rounded-xl">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Спасибо за ваш заказ! ✅</h2>
            <p className="text-xl text-gray-600 mb-6">Заказ принят и передан на сборку.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-700"><strong>Город доставки:</strong> {formData.city}</p>
              <p className="text-sm text-gray-700"><strong>Адрес:</strong> {formData.address} {formData.apartment ? `, ${formData.apartment}` : ''}</p>
              <p className="text-sm text-gray-700"><strong>Телефон:</strong> {formData.phone}</p>
              {selectedAddressId && <p className="text-sm text-gray-600"><strong>Идентификатор адреса:</strong> #{selectedAddressId}</p>}
              <p className="text-sm text-gray-600"><strong>Способ оплаты:</strong>{' '}
                {formData.paymentMethod === 'card' && selectedPaymentId
                  ? (() => {
                      const pm = paymentMethods.find(p => p.id === selectedPaymentId);
                      return pm ? `${pm.brand || 'Карта'} •••• ${pm.last4 || '****'}` : 'Карточка';
                    })()
                  : (formData.paymentMethod === 'card' ? 'Карточка' : 'Наличные')}
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/profile">
                <button className="w-full py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                  Перейти в профиль и историю покупок
                </button>
              </Link>

              <Link href="/animals">
                <button className="w-full py-3 px-4 border border-indigo-600 text-indigo-600 rounded-lg text-lg font-medium hover:bg-indigo-50 transition duration-150">
                  Продолжить покупки
                </button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Оформление заказа
        </h1>

        <div className="mb-10 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          {/* Индикатор шагов */}
          <div className="flex justify-between items-center relative mb-6">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-0">
              <div
                className="h-1 bg-indigo-600 transition-all duration-500"
                style={{
                  width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                }}
              ></div>
            </div>
            {steps.map((s, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition duration-300 ${
                    index + 1 <= step ? 'bg-indigo-600 shadow-lg' : 'bg-gray-400'
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    index + 1 <= step ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPaymentPage;
