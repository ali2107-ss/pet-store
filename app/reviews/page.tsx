'use client'

import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-4 transition-transform hover:scale-[1.01]">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
        <User className="w-6 h-6" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{review.user_name}</p>
        <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="flex items-center space-x-1 text-yellow-500">
      {Array(5).fill(0).map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
    <p className="text-gray-700 leading-relaxed italic">"{review.content}"</p>
  </div>
);

const ReviewsPage = () => {
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Для обработки ошибок бэкенда
  
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const fetchReviews = async () => {
  try {
    const response = await fetch('/api/reviews');
    
    // Если сервер ответил ошибкой (например, 500), не пытаемся парсить JSON
    if (!response.ok) {
      console.error("Сервер вернул ошибку:", response.status);
      return;
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      setRealReviews(data);
    }
  } catch (err) {
    console.error("Не удалось распарсить JSON или нет связи:", err);
  }
};

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // УРОВЕНЬ 2: Отправка на наш защищенный API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content, rating }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Если бэкенд вернул ошибку (400 или 500)
        setErrorMessage(result.error || 'Произошла ошибка');
      } else {
        // Успех
        setName('');
        setContent('');
        setRating(5);
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (err) {
      setErrorMessage('Не удалось связаться с сервером. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = realReviews.length > 0 
    ? parseFloat((realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length).toFixed(1)) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Отзывы покупателей</h1>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 text-yellow-500">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`w-8 h-8 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-800">{averageRating} / 5.0</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-indigo-700 transition-all shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оставить свой отзыв
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {realReviews.map(review => <ReviewCard key={review.id} review={review} />)}
        </div>
      </div>

      {/* МОДАЛЬНОЕ ОКНО С ОБРАБОТКОЙ ОШИБОК */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md w-full relative shadow-2xl border border-gray-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-center mb-8">Ваш отзыв</h2>

            {/* БЛОК ОШИБКИ (УРОВЕНЬ 2) */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-2 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <input 
                required 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20" 
                placeholder="Ваше имя"
                value={name} 
                onChange={e => setName(e.target.value)} 
              />

              <div className="flex bg-gray-50 p-3 rounded-2xl justify-between border border-gray-100">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} type="button" onClick={() => setRating(num)} className={`p-1 ${rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <Star className={`w-7 h-7 ${rating >= num ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>

              <textarea 
                required 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 h-36 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" 
                placeholder="Напишите ваш отзыв..."
                value={content} 
                onChange={e => setContent(e.target.value)} 
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition-all flex justify-center items-center"
              >
                {loading ? <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-6 h-6"></div> : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;