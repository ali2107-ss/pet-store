"use client";
import React, { useState } from "react";
import { Star, MessageCircle, User, X } from "lucide-react";

type Review = {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
};

const INITIAL_REVIEWS: Review[] = [
  { id: 1, user: "Анна К.", rating: 5, text: "Быстрая доставка и отличный корм! Моя кошка в восторге. Буду заказывать только здесь.", date: "2 недели назад" },
  { id: 2, user: "Иван П.", rating: 4, text: "Качественный ошейник, но доставка немного задержалась. В целом доволен.", date: "1 месяц назад" },
  { id: 3, user: "Ольга М.", rating: 5, text: "Просто лучший сервис! Менеджер помог выбрать нужный наполнитель. Спасибо!", date: "3 дня назад" },
  { id: 4, user: "Дмитрий С.", rating: 5, text: "Игрушки очень прочные, собака не смогла их сразу разорвать. Это победа.", date: "3 месяца назад" },
];

// --------- ReviewCard ---------
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
        <User className="w-6 h-6" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{review.user}</p>
        <p className="text-sm text-gray-500">{review.date}</p>
      </div>
    </div>

    <div className="flex items-center space-x-1 text-yellow-500">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 fill-current ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      <span className="text-gray-600 text-sm ml-2 font-medium">{review.rating}.0</span>
    </div>

    <p className="text-gray-700 leading-relaxed italic">"{review.text}"</p>
  </div>
);

// --------- ReviewForm ---------
type ReviewFormData = {
  user?: string;
  rating: number;
  text: string;
};

const ReviewForm: React.FC<{ onSubmit: (data: ReviewFormData) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (text.trim().length < 10) {
      setError("Пожалуйста, напишите отзыв длиной не менее 10 символов.");
      return;
    }

    onSubmit({ user: name || undefined, rating, text });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 sm:p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition p-1 rounded-full hover:bg-gray-100"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Оставить свой отзыв</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ваше Имя (необязательно)
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Например, Александр П."
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка *</label>
            <div className="flex space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => setRating(i + 1)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter" || ev.key === " ") setRating(i + 1);
                    }}
                    className={`w-8 h-8 cursor-pointer transition-colors ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-100"}`}
                    aria-label={`Оценка ${i + 1}`}
                  />
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Вы выбрали: {rating} {rating === 1 ? "звезду" : rating < 5 ? "звезды" : "звезд"}
            </p>
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
              Текст Отзыва *
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Поделитесь вашим мнением о товаре или сервисе..."
            />
            <p className="text-xs text-gray-500 mt-1">Мин. 10 символов. Текущая длина: ({text.length})</p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 shadow-md"
          >
            Отправить отзыв
          </button>
        </form>
      </div>
    </div>
  );
};

// --------- ReviewsPage (основной) ---------
const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSubmitReview = (reviewData: ReviewFormData) => {
    const newReview: Review = {
      id: Date.now(),
      user: reviewData.user || "Аноним",
      rating: reviewData.rating,
      text: reviewData.text,
      date: "только что",
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
  };

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRatingNum = reviews.length > 0 ? totalRating / reviews.length : 0; // number
  const averageRatingStr = averageRatingNum.toFixed(1); // string for display e.g. "4.3"
  const roundedRating = Math.round(averageRatingNum); // number for filled stars

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Отзывы наших покупателей</h1>

          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 text-yellow-500">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} className={`w-8 h-8 fill-current ${i < roundedRating ? "text-yellow-400" : "text-gray-300"}`} />
                ))}
            </div>

            <p className="mt-2 text-3xl font-bold text-gray-800">{averageRatingStr} из 5.0</p>
            <p className="text-lg text-gray-500 mt-1">На основании {reviews.length} отзывов</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center bg-indigo-600 text-white font-medium px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-150 shadow-lg transform hover:scale-[1.02] active:scale-100"
            type="button"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оставить свой отзыв
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Отзывы пока отсутствуют. Будьте первыми!</p>
          </div>
        )}
      </div>

      {showForm && <ReviewForm onSubmit={handleSubmitReview} onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default ReviewsPage;