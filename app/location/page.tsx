import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const LocationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    Наши контакты и адрес
                </h1>
                
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 space-y-8">
                    
                    {/* Информация о компании */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Адрес</h2>
                                <p className="text-gray-700">г. Атырау, ул. Кулманова 111а (ТЦ "BAIZAAR")</p>
                                <p className="text-sm text-gray-500">Пожалуйста, согласуйте визит заранее.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Clock className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">График работы</h2>
                                <p className="text-gray-700">Пн - Пт: 9:00 – 20:00</p>
                                <p className="text-gray-700">Сб: 10:00 – 18:00, Вс: Выходной</p>
                            </div>
                        </div>
                    </div>

                    {/* Контакты */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-4">
                            <Phone className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Телефон</h2>
                                <p className="text-gray-700">+7 (778) 648-28-99</p>
                                <p className="text-sm text-gray-500">Отдел продаж и консультаций</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Mail className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Email</h2>
                                <p className="text-gray-700">ali2107idai@gmail.com</p>
                                <p className="text-sm text-gray-500">Для общих вопросов и сотрудничества</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Карта (заглушка) */}
                <div className="mt-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Наше расположение на карте</h2>
                    <div className="w-full h-80 rounded-xl overflow-hidden"> 
                        <iframe
                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4567.050323707232!2d51.89816129952522!3d47.10721810864396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41a3e98ef74be4b5%3A0x3887796210a6fdfa!2z0KLQoNCmICJCYWl6YWFyIg!5e0!3m2!1sru!2skz!4v1763733236931!5m2!1sru!2skz"
                             width="100%"
                             height="100%"
                             style={{ border: 0 }}
                             allowFullScreen
                             loading="lazy"
                             referrerPolicy="no-referrer-when-downgrade"
                         ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPage;