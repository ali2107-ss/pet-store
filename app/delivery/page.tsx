import React, { useState } from 'react';
import { MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';

const DeliveryPaymentPage = () => {
    const [step, setStep] = useState(1);
    
    const steps = [
        { name: 'Адрес', icon: MapPin },
        { name: 'Оплата', icon: CreditCard },
        { name: 'Подтверждение', icon: CheckCircle },
    ];

    const handleNextStep = () => {
        if (step < 3) setStep(step + 1);
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
                        <div className="bg-gray-100 p-6 rounded-lg text-gray-600">
                            Здесь будут поля для ввода адреса, улицы и телефона.
                        </div>
                        <button onClick={handleNextStep} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                            Перейти к оплате
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <CreditCard className="w-6 h-6 mr-3 text-indigo-600" />
                            Шаг 2: Выбор способа оплаты
                        </h2>
                        <div className="bg-gray-100 p-6 rounded-lg text-gray-600">
                            Здесь будут опции "Онлайн картой" или "Наличными".
                        </div>
                        <button onClick={handleNextStep} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                            Подтвердить заказ
                        </button>
                        <button type="button" onClick={handlePrevStep} className="w-full text-indigo-600 hover:text-indigo-500 font-medium py-2">
                            Назад к адресу
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center p-8 bg-white rounded-xl shadow-2xl border border-green-100">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Спасибо за Ваш заказ!</h2>
                        <p className="text-xl text-gray-600 mb-6">Ваш заказ принят и передан на сборку.</p>
                        <a href="/" className="mt-8 w-full block py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150">
                            Вернуться на главную
                        </a>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    Оформление заказа
                </h1>

                <div className="mb-10 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                    {/* Индикатор шагов */}
                    <div className="flex justify-between items-center relative mb-6">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-0">
                            <div 
                                className="h-1 bg-indigo-600 transition-all duration-500" 
                                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                            ></div>
                        </div>
                        {steps.map((s, index) => (
                            <div key={index} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition duration-300 ${index + 1 <= step ? 'bg-indigo-600 shadow-lg' : 'bg-gray-400'}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <span className={`mt-2 text-sm font-medium ${index + 1 <= step ? 'text-indigo-600' : 'text-gray-500'}`}>{s.name}</span>
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