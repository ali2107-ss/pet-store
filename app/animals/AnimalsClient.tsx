"use client";

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, MapPin, ShoppingCart, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Category {
  id: string;
  name: string;
  icon: null;
  description: string;
}

interface Animal {
  id: number;
  title: string;
  description?: string;
  price: string;
  location?: string;
  image: string;
  category: string;
}

interface AnimalsClientProps {
  categories: Category[];
  initialAnimals?: Animal[];
}

const HorseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M3 17.5a2.5 2.5 0 0 1 2.5-2.5H7l2.5-2 3.5-1.5L16 8.5a3.5 3.5 0 0 1 3.5 3.5V16a1 1 0 0 1-1 1h-1"/><path d="M3 17.5v3a1.5 1.5 0 0 0 3 0v-3"/><path d="M18 17v3a1.5 1.5 0 0 1-3 0v-3"/><path d="M18 12h1a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1h-2"/><path d="M13 6h.01"/><path d="M8.5 12 5 5"/></svg>
);

// Статические данные как fallback если API не работает
const staticAnimalsData: Animal[] = [
  { id: 1, title: 'Золотистый ретривер', price: '150 000 ₸', location: 'Алматы', image: 'https://petsi.net/images/dogbreed/62.jpg', category: 'pets' },
  { id: 2, title: 'Британский котенок', price: '45 000 ₸', location: 'Астана', image: 'https://i.ytimg.com/vi/bkKxxTDH5Ws/maxresdefault.jpg', category: 'pets' },
  { id: 3, title: 'Хаски, 2 месяца', price: '80 000 ₸', location: 'Алматы', image: 'https://santreyd.ru/upload/staff/upload/staff/vplate/all_photos/ecfe7f46696a8e9e1cc5ac9f380c625018a78dc2.jpg', category: 'pets' },
  { id: 4, title: 'Мейн-кун', price: '120 000 ₸', location: 'Караганда', image: 'https://www.thesun.co.uk/wp-content/uploads/2025/05/NINTCHDBPICT000651962807.jpg?strip=all&w=960', category: 'pets' },
  { id: 5, title: 'Корги', price: '200 000 ₸', location: 'Алматы', image: 'https://avatars.mds.yandex.net/i?id=0e81ee755d3fb98418f3b8cf3fb8607a_l-5276035-images-thumbs&n=13', category: 'pets' },
  { id: 6, title: 'Шотландская вислоухая', price: '35 000 ₸', location: 'Шымкент', image: 'https://avatars.mds.yandex.net/i?id=7ed61a5edb5217698489f8c06c2cd9dc068c967b-5222088-images-thumbs&n=13', category: 'pets' },
  { id: 7, title: 'Джунгарский хомяк', price: '1 500 ₸', location: 'Алматы', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/PhodopusSungorus_1.jpg', category: 'rodents' },
  { id: 8, title: 'Морская свинка', price: '5 000 ₸', location: 'Астана', image: 'https://i.pinimg.com/originals/18/18/dc/1818dc5519d9a548a9a45e64c2630223.jpg', category: 'rodents' },
  { id: 9, title: 'Шиншилла', price: '25 000 ₸', location: 'Алматы', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Мраморная_Шиншилла.jpg', category: 'rodents' },
  { id: 10, title: 'Декоративный кролик', price: '12 000 ₸', location: 'Павлодар', image: 'https://10.img.avito.st/image/1/1.rpyuFba4AnXoptR7_huMyaq0AHMQtPBnzLoAdx68Cn8Y.54GGKYH5gqVhO0jx1QN8qWectbpR366vHypf1S6KwRk', category: 'rodents' },
  { id: 11, title: 'Крыса Дамбо', price: '2 500 ₸', location: 'Алматы', image: 'https://i.pinimg.com/736x/72/e0/4a/72e04a862e5153fb0207e5464c11a35c.jpg', category: 'rodents' },
  { id: 12, title: 'Песчанка', price: '1 200 ₸', location: 'Костанай', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Cheesman%27s_Gerbil_2.JPG/1200px-Cheesman%27s_Gerbil_2.JPG', category: 'rodents' },
  { id: 13, title: 'Волнистый попугай', price: '4 000 ₸', location: 'Алматы', image: 'https://avatars.mds.yandex.net/i?id=62f69d7961348c1b6cfb93e94bec19ff_l-12526488-images-thumbs&n=13', category: 'birds' },
  { id: 14, title: 'Канарейка', price: '7 000 ₸', location: 'Астана', image: 'https://miro.medium.com/v2/resize:fit:1200/1*8fPV-sWmqEcoFwldI8Hm4A.jpeg', category: 'birds' },
  { id: 15, title: 'Попугай Корелла', price: '18 000 ₸', location: 'Шымкент', image: 'https://avatars.mds.yandex.net/i?id=1f508741d4bdf229a7d80114513d6c73_l-12623687-images-thumbs&n=13', category: 'birds' },
  { id: 16, title: 'Неразлучники (пара)', price: '15 000 ₸', location: 'Алматы', image: 'https://i.pinimg.com/originals/bd/ca/6e/bdca6e4fc473fd571e01e665e6ed1c8a.jpg', category: 'birds' },
  { id: 17, title: 'Амадины', price: '3 500 ₸', location: 'Актобе', image: 'https://i.pinimg.com/736x/14/e1/89/14e189d61495bf42c05f693ee29a8cb1.jpg', category: 'birds' },
  { id: 18, title: 'Жако', price: '250 000 ₸', location: 'Астана', image: 'https://avatars.mds.yandex.net/i?id=21b844831ef6942bd925e01203fc1233_l-5299794-images-thumbs&n=13', category: 'birds' },
  { id: 19, title: 'Золотая рыбка', price: '800 ₸', location: 'Алматы', image: 'https://exomenu.ru/images/detailed/310/IMG_7968_tuao-3j.jpg', category: 'aqua' },
  { id: 20, title: 'Гуппи (10 шт)', price: '2 000 ₸', location: 'Астана', image: 'https://media.makler.md/production/an/original/000/068/014/000068014704.jpg', category: 'aqua' },
  { id: 21, title: 'Аквариум 100л', price: '35 000 ₸', location: 'Караганда', image: 'https://dolinaakvariumov.ru/image/cache/catalog/Akvas_2024/pryamoj/100lbelenijdub-650x650.jpg', category: 'aqua' },
  { id: 22, title: 'Сом Анциструс', price: '1 500 ₸', location: 'Алматы', image: 'https://avatars.mds.yandex.net/i?id=2a32b8221aa7cd149b1a83da11b95aca_l-5239800-images-thumbs&n=13', category: 'aqua' },
  { id: 23, title: 'Петушок', price: '2 500 ₸', location: 'Тараз', image: 'https://wallpapers.com/images/hd/vibrant-betta-fish-swimming-jpg-jxcp82ws2oc36mv2.jpg', category: 'aqua' },
  { id: 24, title: 'Скалярия', price: '1 200 ₸', location: 'Алматы', image: 'https://avatars.mds.yandex.net/i?id=48cde984cb66c410b0ef2a0585a2506b_l-5313239-images-thumbs&n=13', category: 'aqua' },
  { id: 25, title: 'Английская чистокровная', price: '2 500 000 ₸', location: 'Алматинская обл.', image: 'https://i.pinimg.com/originals/9a/9c/8f/9a9c8f9281052569f8e20c4c4ca4a019.jpg', category: 'horses' },
  { id: 26, title: 'Пони Шетлендский', price: '400 000 ₸', location: 'Астана', image: 'https://avatars.mds.yandex.net/i?id=8b5b9964abc618066b632fd83f623153663f804b-11908484-images-thumbs&n=13', category: 'horses' },
  { id: 27, title: 'Орловский рысак', price: '1 200 000 ₸', location: 'Кокшетау', image: 'https://i.pinimg.com/originals/0f/e9/6a/0fe96a0d0d1a77719ce699a22e136be5.jpg', category: 'horses' },
  { id: 28, title: 'Жеребенок (6 мес)', price: '250 000 ₸', location: 'Талдыкорган', image: 'https://i.pinimg.com/736x/1c/f8/a4/1cf8a4cf1dbf8a07f4cdae1d8fe35cc9.jpg', category: 'horses' },
  { id: 29, title: 'Ахалтекинец', price: '5 000 000 ₸', location: 'Алматы', image: 'https://avatars.mds.yandex.net/i?id=d11598f2f152becdacd6d5b89652fe0ba4b6fb5c-9197564-images-thumbs&n=13', category: 'horses' },
  { id: 30, title: 'Лошадь для кокпара', price: '6 000 000 ₸', location: 'Шымкент', image: 'https://i.pinimg.com/736x/de/1b/68/de1b684b05cb224a95d27b079f99509a.jpg', category: 'horses' },
  { id: 31, title: 'Корова дойная', price: '450 000 ₸', location: 'Туркестан', image: 'https://avatars.mds.yandex.net/i?id=0092efb7acadae86d1baec29125d5f3d_l-5233043-images-thumbs&n=13', category: 'farm' },
  { id: 32, title: 'Овцы (Эдильбаевские)', price: '60 000 ₸', location: 'Жамбылская обл.', image: 'https://frankfurt2.apollo.olxcdn.com/v1/files/rglbaj9w93q33-KZ/image;s=621x359;q=50', category: 'farm' },
  { id: 33, title: 'Коза молочная', price: '40 000 ₸', location: 'Алматинская обл.', image: 'https://avatars.dzeninfra.ru/get-zen_doc/3845269/pub_61aedfd2e8508f6ea8a42cba_61aedfea42eb93585674b3f1/scale_1200', category: 'farm' },
  { id: 34, title: 'Бычок на откорм', price: '180 000 ₸', location: 'Акмолинская обл.', image: 'https://i.pinimg.com/736x/7b/2f/56/7b2f5608c901b03fbbee188450e7abd1.jpg', category: 'farm' },
  { id: 35, title: 'Ягнята', price: '25 000 ₸', location: 'Шымкент', image: 'https://i.pinimg.com/originals/3e/6b/36/3e6b368dd487fa8e3b262076732450e6.jpg', category: 'farm' },
  { id: 36, title: 'Куры несушки', price: '2 500 ₸', location: 'Алматы', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixid=M3wzOTE5Mjl8MHwxfHNlYXJjaHwyfHxjaGlja2Vuc3xlbnwwfHx8fDE2OTUxMjUzNDV8MA&ixlib=rb-4.0.3&auto=format&fit=crop&w=656&h=528', category: 'farm' },
];

export default function AnimalsClient({ categories, initialAnimals }: AnimalsClientProps) {
  // Используем статические данные как fallback если API пусто
  const animalsToUse = initialAnimals && initialAnimals.length > 0 ? initialAnimals : staticAnimalsData;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>(animalsToUse);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const { addToCart } = useCart();

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const filtered = animalsToUse.filter((a: Animal) => a.category === categoryId);
    setFilteredAnimals(filtered);
  };

  const activeCategoryData = selectedCategory
    ? categories.find((c: Category) => c.id === selectedCategory)
    : null;

  const handleAddToCart = (animal: Animal) => {
    // Добавляем в контекст
    addToCart({
      id: animal.id,
      title: animal.title,
      price: animal.price,
      image: animal.image,
      category: animal.category,
      quantity: 1,
    });

    // Показываем анимацию
    setAddedItemId(animal.id);
    setTimeout(() => setAddedItemId(null), 600);

    // Уведомление
    alert(`✅ "${animal.title}" добавлен в корзину!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!selectedCategory ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
                Животные
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Найдите своего идеального питомца или пополните хозяйство. Все
                животные прошли ветеринарный контроль.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat: Category) => (
                <div
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                >
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                    <div className="text-indigo-600 group-hover:text-white transition-colors duration-300">
                      <HorseIcon />
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

            <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-indigo-50 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Не нашли кого искали?
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Мы сотрудничаем с лучшими питомниками и фермами. Оставьте
                  заявку, и мы поможем найти конкретную породу или вид животного.
                </p>
                <a href="/application">
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    Оставить заявку на поиск
                  </button>
                </a>
              </div>
              <div className="w-full md:w-1/3 bg-indigo-50 rounded-2xl p-6 text-center">
                <p className="text-indigo-900 font-bold text-lg mb-2">
                  Горячая линия
                </p>
                <p className="text-3xl font-extrabold text-indigo-600">
                  +7 (777) 123-45-67
                </p>
                <p className="text-sm text-indigo-400 mt-2">
                  Ежедневно с 9:00 до 21:00
                </p>
              </div>
            </div>
          </>
        ) : (
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
                  {filteredAnimals.length} объявлений
                </span>
              </h2>
              <p className="text-gray-600 mt-2">
                {activeCategoryData?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={animal.image}
                      alt={animal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      aria-label={`Добавить "${animal.title}" в избранное`}
                      title={`Добавить "${animal.title}" в избранное`}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-all"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> {animal.location}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {animal.title}
                    </h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-indigo-600">
                        {animal.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(animal)}
                        className={`flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-95 ${
                          addedItemId === animal.id ? 'scale-110 bg-green-600' : ''
                        }`}
                      >
                        <ShoppingCart className={`w-4 h-4 mr-2 transition-transform ${addedItemId === animal.id ? 'scale-150' : ''}`} />
                        {addedItemId === animal.id ? 'Добавлено!' : 'Купить'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAnimals.length === 0 && (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-xl">В этой категории пока нет объявлений.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
