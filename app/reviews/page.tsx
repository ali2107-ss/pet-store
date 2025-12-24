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
  // Состояния для данных
  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Состояния для полей формы
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  // 1. Функция загрузки отзывов из Supabase
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setRealReviews(data);
    } else {
      console.error("Ошибка загрузки:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Функция отправки нового отзыва
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return alert("Пожалуйста, заполните все поля");

    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .insert([{ 
        user_name: name, 
        content: content, 
        rating: rating 
      }]);

    if (error) {
      alert("Ошибка при сохранении: " + error.message);
    } else {
      // Очистка и закрытие
      setName('');
      setContent('');
      setRating(5);
      setIsModalOpen(false);
      fetchReviews(); // Обновляем список на лету
    }
    setLoading(false);
  };

  // Расчет среднего рейтинга
  const averageRating = realReviews.length > 0 
    ? parseFloat((realReviews.reduce((sum, r) => sum + r.rating, 0) / realReviews.length).toFixed(1)) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Шапка страницы */}
        <header className="text-center mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Отзывы наших покупателей</h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 text-yellow-500">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-8 h-8 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-800">{averageRating} из 5.0</p>
            <p className="text-lg text-gray-500 mt-1">На основании {realReviews.length} отзывов</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оставить свой отзыв
          </button>
        </header>

        {/* Сетка отзывов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {realReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Если отзывов нет */}
        {realReviews.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl italic">Отзывов пока нет. Станьте первым, кто его оставит!</p>
          </div>
        )}
      </div>

      {/* МОДАЛЬНОЕ ОКНО С ОБНОВЛЕННЫМ ДИЗАЙНОМ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 max-w-md w-full relative shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100/50">
            
            {/* Кнопка закрытия (крестик) */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Ваш отзыв</h2>
              <p className="text-gray-500 mt-2 font-medium">Нам очень важно ваше мнение</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Поле Имя */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Как вас зовут?</label>
                <input 
                  required 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400" 
                  placeholder="Введите ваше имя"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>

              {/* Выбор рейтинга (звезды) */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Ваша оценка</label>
                <div className="flex bg-gray-50/50 p-3 rounded-2xl justify-between border border-gray-100">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl transition-all duration-200 ${rating >= num ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}
                    >
                      <Star className={`w-7 h-7 ${rating >= num ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Поле Сообщение */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Ваш комментарий</label>
                <textarea 
                  required 
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-gray-900 h-36 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-gray-400" 
                  placeholder="Поделитесь впечатлениями о покупке..."
                  value={content} 
                  onChange={e => setContent(e.target.value)} 
                />
              </div>

              {/* Кнопка */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.97] transition-all flex justify-center items-center space-x-3"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-6 h-6"></div>
                ) : (
                  <>
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-lg">Опубликовать</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;