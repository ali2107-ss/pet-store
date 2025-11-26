"use client";

import React, { useState } from 'react';
import { Dog, Cat, Mouse, Bird, Tent, Sprout, ArrowLeft, Heart, MapPin, ShoppingCart } from 'lucide-react';

// Иконка Лошади
const HorseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M3 17.5a2.5 2.5 0 0 1 2.5-2.5H7l2.5-2 3.5-1.5L16 8.5a3.5 3.5 0 0 1 3.5 3.5V16a1 1 0 0 1-1 1h-1"/><path d="M3 17.5v3a1.5 1.5 0 0 0 3 0v-3"/><path d="M18 17v3a1.5 1.5 0 0 1-3 0v-3"/><path d="M18 12h1a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-2"/><path d="M13 6h.01"/><path d="M8.5 12 5 5"/></svg>
);

// --- ДАННЫЕ ---

const categories = [
    { id: 'pets', name: "Собаки и Кошки", icon: Dog, description: "Элитные породы, щенки, котята и надежные компаньоны." },
    { id: 'rodents', name: "Домашние Грызуны", icon: Mouse, description: "Хомяки, морские свинки, декоративные кролики и шиншиллы." },
    { id: 'birds', name: "Птицы", icon: Bird, description: "Попугаи (волнистые, ара, какаду), канарейки и певчие птицы." },
    { id: 'aqua', name: "Аквариумистика", icon: Tent, description: "Экзотические рыбки, улитки, креветки и водные растения." },
    { id: 'horses', name: "Лошади и Пони", icon: HorseIcon, description: "Спортивные, прогулочные лошади и пони для детей." },
    { id: 'farm', name: "Сельхоз животные", icon: Sprout, description: "Коровы, овцы, козы и домашняя птица для фермы." },
];

const animalsData = {
    'pets': [
        { id: 1, name: 'Золотистый ретривер', price: '150 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Ретривер' },
        { id: 2, name: 'Британский котенок', price: '45 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/f1f5f9/334155?text=Котенок' },
        { id: 3, name: 'Хаски, 2 месяца', price: '80 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Хаски' },
        { id: 4, name: 'Мейн-кун', price: '120 000 ₸', location: 'Караганда', image: 'https://placehold.co/400x300/f1f5f9/334155?text=Мейн-кун' },
        { id: 5, name: 'Корги', price: '200 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Корги' },
        { id: 6, name: 'Шотландская вислоухая', price: '35 000 ₸', location: 'Шымкент', image: 'https://placehold.co/400x300/f1f5f9/334155?text=Скоттиш' },
    ],
    'rodents': [
        { id: 1, name: 'Джунгарский хомяк', price: '1 500 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/fff7ed/9a3412?text=Хомяк' },
        { id: 2, name: 'Морская свинка', price: '5 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/ffedd5/c2410c?text=Свинка' },
        { id: 3, name: 'Шиншилла', price: '25 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/fff7ed/9a3412?text=Шиншилла' },
        { id: 4, name: 'Декоративный кролик', price: '12 000 ₸', location: 'Павлодар', image: 'https://placehold.co/400x300/ffedd5/c2410c?text=Кролик' },
        { id: 5, name: 'Крыса Дамбо', price: '2 500 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/fff7ed/9a3412?text=Крыса' },
        { id: 6, name: 'Песчанка', price: '1 200 ₸', location: 'Костанай', image: 'https://placehold.co/400x300/ffedd5/c2410c?text=Песчанка' },
    ],
    'birds': [
        { id: 1, name: 'Волнистый попугай', price: '4 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/ecfccb/3f6212?text=Попугай' },
        { id: 2, name: 'Канарейка', price: '7 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/f7fee7/4d7c0f?text=Канарейка' },
        { id: 3, name: 'Попугай Корелла', price: '18 000 ₸', location: 'Шымкент', image: 'https://placehold.co/400x300/ecfccb/3f6212?text=Корелла' },
        { id: 4, name: 'Неразлучники (пара)', price: '15 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/f7fee7/4d7c0f?text=Неразлучники' },
        { id: 5, name: 'Амадины', price: '3 500 ₸', location: 'Актобе', image: 'https://placehold.co/400x300/ecfccb/3f6212?text=Амадины' },
        { id: 6, name: 'Жако', price: '250 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/f7fee7/4d7c0f?text=Жако' },
    ],
    'aqua': [
        { id: 1, name: 'Золотая рыбка', price: '800 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/ecfeff/0e7490?text=Рыбка' },
        { id: 2, name: 'Гуппи (10 шт)', price: '2 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/cffafe/155e75?text=Гуппи' },
        { id: 3, name: 'Аквариум 100л', price: '35 000 ₸', location: 'Караганда', image: 'https://placehold.co/400x300/ecfeff/0e7490?text=Аквариум' },
        { id: 4, name: 'Сом Анциструс', price: '1 500 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/cffafe/155e75?text=Сом' },
        { id: 5, name: 'Петушок', price: '2 500 ₸', location: 'Тараз', image: 'https://placehold.co/400x300/ecfeff/0e7490?text=Петушок' },
        { id: 6, name: 'Скалярия', price: '1 200 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/cffafe/155e75?text=Скалярия' },
    ],
    'horses': [
        { id: 1, name: 'Английская чистокровная', price: '2 500 000 ₸', location: 'Алматинская обл.', image: 'https://placehold.co/400x300/fdf4ff/86198f?text=Лошадь' },
        { id: 2, name: 'Пони Шетлендский', price: '400 000 ₸', location: 'Астана', image: 'https://placehold.co/400x300/fae8ff/a21caf?text=Пони' },
        { id: 3, name: 'Орловский рысак', price: '1 200 000 ₸', location: 'Кокшетау', image: 'https://placehold.co/400x300/fdf4ff/86198f?text=Рысак' },
        { id: 4, name: 'Жеребенок (6 мес)', price: '250 000 ₸', location: 'Талдыкорган', image: 'https://placehold.co/400x300/fae8ff/a21caf?text=Жеребенок' },
        { id: 5, name: 'Ахалтекинец', price: '5 000 000 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/fdf4ff/86198f?text=Ахалтекинец' },
        { id: 6, name: 'Мерин для прогулок', price: '600 000 ₸', location: 'Шымкент', image: 'https://placehold.co/400x300/fae8ff/a21caf?text=Мерин' },
    ],
    'farm': [
        { id: 1, name: 'Корова дойная', price: '450 000 ₸', location: 'Туркестан', image: 'https://placehold.co/400x300/f0fdf4/15803d?text=Корова' },
        { id: 2, name: 'Овцы (Эдильбаевские)', price: '60 000 ₸', location: 'Жамбылская обл.', image: 'https://placehold.co/400x300/dcfce7/166534?text=Овцы' },
        { id: 3, name: 'Коза молочная', price: '40 000 ₸', location: 'Алматинская обл.', image: 'https://placehold.co/400x300/f0fdf4/15803d?text=Коза' },
        { id: 4, name: 'Бычок на откорм', price: '180 000 ₸', location: 'Акмолинская обл.', image: 'https://placehold.co/400x300/dcfce7/166534?text=Бычок' },
        { id: 5, name: 'Ягнята', price: '25 000 ₸', location: 'Шымкент', image: 'https://placehold.co/400x300/f0fdf4/15803d?text=Ягнята' },
        { id: 6, name: 'Куры несушки', price: '2 500 ₸', location: 'Алматы', image: 'https://placehold.co/400x300/dcfce7/166534?text=Куры' },
    ]
};

const AnimalsPage = () => {
    // Состояние для выбранной категории
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const activeCategoryData = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;
    const activeAnimals = selectedCategory ? animalsData[selectedCategory as keyof typeof animalsData] : [];

    // Функция для добавления в корзину (симуляция)
    const addToCart = (animal: any) => {
        // Здесь вы можете вызвать вашу реальную логику добавления в корзину
        // Например: dispatch(addToCartAction(animal)) или context.addToCart(animal)
        
        console.log('Добавлено в корзину:', animal);
        alert(`"${animal.name}" успешно добавлен в корзину!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Если категория НЕ выбрана, показываем список категорий */}
                {!selectedCategory ? (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
                                Животные
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Найдите своего идеального питомца или пополните хозяйство. Все животные прошли ветеринарный контроль.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((cat) => (
                                <div 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                                >
                                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                                        <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                                            <cat.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {cat.name}
                                    </h2>
                                    <p className="text-gray-500 leading-relaxed mb-6">
                                        {cat.description}
                                    </p>
                                    <span className="inline-flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                        Смотреть объявления →
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Блок с информацией */}
                        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-indigo-50 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Не нашли кого искали?</h3>
                                <p className="text-lg text-gray-600 mb-6">
                                    Мы сотрудничаем с лучшими питомниками и фермами. Оставьте заявку, и мы поможем найти конкретную породу или вид животного.
                                </p>
                                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Оставить заявку на поиск
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 bg-indigo-50 rounded-2xl p-6 text-center">
                                <p className="text-indigo-900 font-bold text-lg mb-2">Горячая линия</p>
                                <p className="text-3xl font-extrabold text-indigo-600">+7 (777) 123-45-67</p>
                                <p className="text-sm text-indigo-400 mt-2">Ежедневно с 9:00 до 21:00</p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Если категория ВЫБРАНА, показываем список животных */
                    <div className="animate-fade-in">
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" /> Назад к категориям
                        </button>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                                {activeCategoryData?.name}
                                <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {activeAnimals.length} объявлений
                                </span>
                            </h2>
                            <p className="text-gray-600 mt-2">{activeCategoryData?.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeAnimals.map((animal) => (
                                <div key={animal.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img 
                                            src={animal.image} 
                                            alt={animal.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <button
                                            aria-label={`Добавить "${animal.name}" в избранное`}
                                            title={`Добавить "${animal.name}" в избранное`}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all"
                                        >
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {animal.location}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{animal.name}</h3>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-2xl font-bold text-indigo-600">{animal.price}</span>
                                            {/* КНОПКА КУПИТЬ */}
                                            <button 
                                                onClick={() => addToCart(animal)}
                                                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Купить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {activeAnimals.length === 0 && (
                            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-xl">В этой категории пока нет объявлений.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimalsPage;