/** @type {import('next').NextConfig} */
const nextConfig = {
  // Добавляем домены изображений для компонента next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Сюда ты можешь добавить другие домены, например, своего сервера с картинками
    ],
  },
};

export default nextConfig;