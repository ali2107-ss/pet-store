// Этот файл - главный макет сайта, написанный на TypeScript.
// Он "оборачивает" все твои страницы.
// Next.js автоматически импортирует CSS и компоненты.

import { Inter } from "next/font/google";
import Link from "next/link";
// В TypeScript нужно правильно указать путь до CSS.
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

// Типы для children (основного содержимого страницы)
interface RootLayoutProps {
  children: React.ReactNode;
}

// 'metadata' - информация для вкладки в браузере.
export const metadata = {
  title: "PetPalace - Ваш Зоомагазин",
  description: "Все для ваших любимцев в одном месте!",
};

// Это и есть твой Макет
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-100 text-gray-900 antialiased`}>

        {/* === НАВИГАЦИЯ (ШАПКА САЙТА) === */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Логотип - ссылка на главную страницу */}
            <Link href="/" className="text-3xl font-bold text-indigo-600">
              PetPalace
            </Link>
            
            {/* Ссылки для ПК */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Главная
              </Link>
              <Link href="/shop" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Магазин
              </Link>
              <Link href="/reviews" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Отзывы
              </Link>
              <Link href="/location" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Контакты
              </Link>
               <Link href="/profile" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Профиль
              </Link>
            </div>
            
            {/* Иконки (Корзина, Вход) */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
                {/* Иконка корзины */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Счетчик товаров (симуляция) */}
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
              </Link>
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
                Войти
              </Link>
            </div>
          </nav>
        </header>

        {/* === ОСНОВНОЕ СОДЕРЖИМОЕ === */}
        <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-250px)]">
          {children}
        </main>

        {/* === ПОДВАЛ (FOOTER) === */}
        <footer className="bg-gray-800 text-gray-300 mt-16">
          <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">PetPalace</h3>
              <p className="text-gray-400">Все для счастливой жизни ваших любимцев.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Каталог</h4>
              <ul className="space-y-2">
                <li><Link href="/shop" className="hover:text-white">Для собак</Link></li>
                <li><Link href="/shop" className="hover:text-white">Для кошек</Link></li>
                <li><Link href="/shop" className="hover:text-white">Грызуны и птицы</Link></li>
                <li><Link href="/shop" className="hover:text-white">Аквариумистика</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Информация</h4>
              <ul className="space-y-2">
                <li><Link href="/location" className="hover:text-white">О нас</Link></li>
                <li><Link href="/reviews" className="hover:text-white">Отзывы</Link></li>
                <li><Link href="/delivery" className="hover:text-white">Доставка и оплата</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Мы в соцсетях</h4>
              {/* Иконки соцсетей (просто для примера) */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">VK</a>
                <a href="#" className="text-gray-400 hover:text-white">Telegram</a>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 py-4">
            <p className="text-center text-gray-500 text-sm">© 2025 PetPalace. Все права защищены.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}