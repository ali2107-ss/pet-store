// Страница магазина (каталог товаров)

import Link from "next/link";
import Image from "next/image";

// Тип для товара
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
}

// Моковые данные (временный список товаров)
const mockProducts: Product[] = [
  { id: 1, name: "Корм для взрослых собак (10 кг)", category: "Собаки", price: 3500, imageUrl: "https://placehold.co/400x300/e0f2f1/000000?text=Dog+Food+10kg", rating: 4.8 },
  { id: 2, name: "Игрушка-пищалка 'Мышь'", category: "Кошки", price: 450, imageUrl: "https://placehold.co/400x300/fff3e0/000000?text=Mouse+Toy", rating: 4.5 },
  { id: 3, name: "Большая клетка для хомяка", category: "Грызуны", price: 1800, imageUrl: "https://placehold.co/400x300/ede7f6/000000?text=Hamster+Cage", rating: 4.9 },
  { id: 4, name: "Шампунь для длинношерстных кошек", category: "Кошки", price: 780, imageUrl: "https://placehold.co/400x300/fbe9e7/000000?text=Cat+Shampoo", rating: 4.3 },
  { id: 5, name: "Поводок-рулетка (5 м)", category: "Собаки", price: 1250, imageUrl: "https://placehold.co/400x300/e8f5e9/000000?text=Leash+5m", rating: 4.6 },
  { id: 6, name: "Наполнитель силикагелевый (5 л)", category: "Кошки", price: 990, imageUrl: "https://placehold.co/400x300/e0f7fa/000000?text=Litter+Filler", rating: 5.0 },
];

// Компонент карточки товара
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-[1.02] transition-transform duration-300">
    <div className="relative h-48">
      <Image 
        src={product.imageUrl} 
        alt={product.name} 
        fill 
        style={{ objectFit: 'cover' }}
        className="transition-opacity duration-300 hover:opacity-80"
      />
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <p className="text-sm text-indigo-500 font-semibold mb-1">{product.category}</p>
      <h3 className="text-xl font-bold text-gray-800 mb-2 flex-grow">{product.name}</h3>
      <div className="flex items-center text-yellow-500 mb-4">
        <span className="font-semibold mr-1">{product.rating}</span>
        {/* Простая симуляция звезд */}
        {'★'.repeat(Math.floor(product.rating))}
        {'☆'.repeat(5 - Math.floor(product.rating))}
      </div>
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="text-2xl font-extrabold text-indigo-600">{product.price.toLocaleString()} ₽</span>
        <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors font-semibold shadow-md active:scale-95">
          В корзину
        </button>
      </div>
    </div>
  </div>
);

// Компонент главной страницы Магазина
const ShopPage = () => {
  return (
    <section>
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">Каталог товаров</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Левая колонка: Фильтры */}
        <aside className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">Фильтры</h2>
          
          {/* Фильтр по виду животного */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold mb-3">Виды животных</h3>
            <div className="space-y-2">
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="form-checkbox text-indigo-600 rounded" defaultChecked />
                <span className="ml-2">Собаки</span>
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="form-checkbox text-indigo-600 rounded" defaultChecked />
                <span className="ml-2">Кошки</span>
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="form-checkbox text-indigo-600 rounded" />
                <span className="ml-2">Птицы и Грызуны</span>
              </label>
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="form-checkbox text-indigo-600 rounded" />
                <span className="ml-2">Аквариумистика</span>
              </label>
            </div>
          </div>

          {/* Фильтр по цене (слайдер) */}
          <div className="mb-6 pb-4">
            <h3 className="text-lg font-semibold mb-3">Цена (₽)</h3>
            {/* Это просто макет. Реальный слайдер требует стейта. */}
            <input type="range" min="100" max="5000" defaultValue="5000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>100</span>
              <span>5000+</span>
            </div>
          </div>
          
          <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-bold hover:bg-indigo-600 transition-colors">
            Применить фильтры
          </button>
        </aside>

        {/* Правая колонка: Список товаров */}
        <div className="md:col-span-3">
          <div className="mb-6 flex justify-between items-center border-b pb-4">
            <p className="text-gray-600">Найдено: {mockProducts.length} товаров</p>
            <select className="p-2 border border-gray-300 rounded-lg">
              <option>Сначала популярные</option>
              <option>Сначала дешевые</option>
              <option>Сначала дорогие</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Пагинация (просто макет) */}
          <div className="flex justify-center mt-12 space-x-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">1</button>
            <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">2</button>
            <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">3</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopPage;