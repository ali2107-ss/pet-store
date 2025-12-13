import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function LocationPage() {
    // URL для встраивания карты Google Maps (заменен на унифицированный формат, 
    // поскольку прямую ссылку на "поделиться" нельзя использовать в iframe)
    const mapEmbedUrl = "https://maps.google.com/maps?q=Атырау%2C%20улица%20Сатпаева%2C%207&t=&z=15&ie=UTF8&iwloc=&output=embed";

    return (
        <section className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center border-b pb-4">
                    <MapPin className="w-10 h-10 mr-3 text-indigo-600"/>
                    Контакты и Адрес
                </h1>
                
                <p className="mb-6 text-lg text-gray-700">
                    Здесь вы можете найти наш адрес, часы работы и способы связи для планирования вашего визита.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    
                    {/* Блок Адрес и Связь */}
                    <div className="p-6 rounded-xl border border-indigo-200 bg-indigo-50">
                        <h2 className="text-xl font-bold mb-4 text-indigo-800 flex items-center">
                            <Mail className="w-5 h-5 mr-2" />
                            Связь
                        </h2>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3 text-indigo-500" />
                                <span className="font-semibold">Адрес:</span> г. Атырау, улица Сатпаева, 7
                            </p>
                            <p className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-indigo-500" />
                                <span className="font-semibold">Телефон:</span> +7 706 717 0196
                            </p>
                            <p className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-indigo-500" />
                                <span className="font-semibold">Email:</span> alisher.karataev@mail.ru
                            </p>
                        </div>
                    </div>

                    {/* Блок Часы работы */}
                    <div className="p-6 rounded-xl border border-green-200 bg-green-50">
                        <h2 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Часы работы
                        </h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between border-b border-green-100 pb-1">
                                <span className="font-medium">Пн–Пт:</span> 
                                <span className="text-green-700 font-semibold">10:00 — 20:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-medium">Сб–Вс:</span> 
                                <span className="text-green-700 font-semibold">10:00 — 18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* ВСТАВЛЕННА КАРТА */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Расположение на карте</h2>
                    <div className="w-full h-96 rounded-xl overflow-hidden shadow-xl border border-gray-200">
                        {/* Использование iframe для встраивания Google Maps. 
                          Примечание: для рабочей версии часто требуется API ключ и более сложный компонент. 
                          Здесь используется унифицированный URL для встраивания.
                        */}
                        <iframe 
                            title="Карта расположения Pet Store"
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            style={{ border: 0 }} 
                            src={mapEmbedUrl}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}