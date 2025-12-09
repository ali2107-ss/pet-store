import React from 'react';
import AnimalsClient from './AnimalsClient';

const categories = [
  {
    id: 'pets',
    name: 'Собаки и Кошки',
    icon: null,
    description: 'Элитные породы, щенки, котята и надежные компаньоны.',
  },
  {
    id: 'rodents',
    name: 'Домашние Грызуны',
    icon: null,
    description: 'Хомяки, морские свинки, декоративные кролики и шиншиллы.',
  },
  {
    id: 'birds',
    name: 'Птицы',
    icon: null,
    description: 'Попугаи (волнистые, ара, какаду), канарейки и певчие птицы.',
  },
  {
    id: 'aqua',
    name: 'Аквариумистика',
    icon: null,
    description: 'Экзотические рыбки, улитки, креветки и водные растения.',
  },
  {
    id: 'horses',
    name: 'Лошади и Пони',
    icon: null,
    description: 'Спортивные, прогулочные лошади и пони для детей.',
  },
  {
    id: 'farm',
    name: 'Сельхоз животные',
    icon: null,
    description: 'Коровы, овцы, козы и домашняя птица для фермы.',
  },
];

// Server Component: загружаем данные с API при рендере на сервере
async function fetchAnimals() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/animals`, {
      next: { revalidate: 60 }, // ISR: переиндексируем каждые 60 сек
    });

    if (!res.ok) {
      console.error('Failed to fetch animals:', res.status);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Error fetching animals:', err);
    return [];
  }
}

export default async function AnimalsPage() {
  const animals = await fetchAnimals();

  return <AnimalsClient categories={categories} initialAnimals={animals} />;
}
