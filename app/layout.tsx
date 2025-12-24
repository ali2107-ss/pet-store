import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { OrdersProvider } from "../context/OrdersContext";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "PetPalace - Ваш Зоомагазин",
  description: "Все для ваших любимцев в одном месте!",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-100 text-gray-900 antialiased`}>

        <FavoritesProvider>
          <CartProvider>
            <OrdersProvider>
              {/* === ШАПКА САЙТА === */}
              <Header />

              {/* === ОСНОВНОЕ СОДЕРЖИМОЕ === */}
              <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-250px)]">
                {children}
              </main>
            </OrdersProvider>
          </CartProvider>
        </FavoritesProvider>

        {/* === ПОДВАЛ === */}
        <footer className="bg-gray-800 text-gray-300 mt-16">
          <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">PetPalace</h3>
              <p className="text-gray-400">
                Все для счастливой жизни ваших любимцев.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Каталог</h4>
              <ul className="space-y-2">
                <li><a href="/shop" className="hover:text-white">Для собак</a></li>
                <li><a href="/shop" className="hover:text-white">Для кошек</a></li>
                <li><a href="/shop" className="hover:text-white">Грызуны и птицы</a></li>
                <li><a href="/shop" className="hover:text-white">Аквариумистика</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Информация</h4>
              <ul className="space-y-2">
                <li><a href="/location" className="hover:text-white">О нас</a></li>
                <li><a href="/reviews" className="hover:text-white">Отзывы</a></li>
                <li><a href="/delivery" className="hover:text-white">Доставка и оплата</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Мы в соцсетях
              </h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/pet_store_akmol?igsh=cmdjMm9kczR4eXR2" className="hover:text-white">Instagram</a>
                <a href="https://t.me/Pet_store7" className="hover:text-white">Telegram</a>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 py-4">
            <p className="text-center text-gray-500 text-sm">
              © 2025 PetPalace. Все права защищены.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
