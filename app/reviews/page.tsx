'use client'

import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, X } from 'lucide-react';
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
        <Star
          key={i}
          className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-gray-600 text-sm ml-2 font-medium">{review.rating}.0</span>
    </div>

    <p className="text-gray-700 leading-relaxed italic">"{review.content}"</p>
  </div>
);

const ReviewsPage = () => {
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setRealReviews(data);
    } catch (err) {
      console.log("Ожидание данных..."); // Заменяем ошибку сессии на мягкий лог
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Отправляем данные на наш СОБСТВЕННЫЙ бэкенд (API), а не напрямую в базу
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content, rating }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Если бэкенд вернул ошибку валидации (400)
      alert(result.error);
    } else {
      // Если всё успешно
      setName('');
      setContent('');
      setRating(5);
      setIsModalOpen(false);
      fetchReviews(); // Обновляем список
    }
  } catch (err) {
    alert("Критическая ошибка при отправке");
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
                <Star 
                  key={i} 
                  className={`w-8 h-8 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-800">{averageRating} / 5.0</p>
            <p className="text-lg text-gray-500">На основе {realReviews.length} отзывов</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оставить свой отзыв
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {realReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {realReviews.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            Отзывов пока нет. Будьте первым!
          </div>
        )}
      </div>

      {/* МОДАЛЬНОЕ ОКНО */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Ваш отзыв</h2>
              <p className="text-gray-500 mt-2">Поделитесь вашим опытом</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Имя</label>
                <input 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                  placeholder="Ваше имя"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Оценка</label>
                <div className="flex bg-gray-50 p-3 rounded-2xl justify-between border border-gray-100">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-1 transition-all ${rating >= num ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}
                    >
                      <Star className={`w-7 h-7 ${rating >= num ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Сообщение</label>
                <textarea 
                  required 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-900 h-36 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" 
                  placeholder="Напишите ваш отзыв..."
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.97] transition-all flex justify-center items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-6 h-6"></div>
                ) : (
                  <>
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-lg">Отправить отзыв</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;