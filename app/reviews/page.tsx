import React from 'react';
import { Star, MessageCircle, User } from 'lucide-react';

// Моковые данные об отзывах
const reviews = [
    { id: 1, user: 'Анна К.', rating: 5, text: 'Быстрая доставка и отличный корм! Моя кошка в восторге. Буду заказывать только здесь.', date: '2 недели назад' },
    { id: 2, user: 'Иван П.', rating: 4, text: 'Качественный ошейник, но доставка немного задержалась. В целом доволен.', date: '1 месяц назад' },
    { id: 3, user: 'Ольга М.', rating: 5, text: 'Просто лучший сервис! Менеджер помог выбрать нужный наполнитель. Спасибо!', date: '3 дня назад' },
    { id: 4, user: 'Дмитрий С.', rating: 5, text: 'Игрушки очень прочные, собака не смогла их сразу разорвать. Это победа.', date: '3 месяца назад' },
];

const ReviewCard = ({ review }) => (
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
            {Array(5).fill(0).map((_, i) => (
                <Star 
                    key={i} 
                    className={`w-5 h-5 fill-current ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
            ))}
            <span className="text-gray-600 text-sm ml-2 font-medium">{review.rating}.0</span>
        </div>
        
        <p className="text-gray-700 leading-relaxed italic">
            "{review.text}"
        </p>
    </div>
);

const ReviewsPage = () => {
    // Вычисление средней оценки
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12 bg-white p-8 rounded-xl shadow-md">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Отзывы наших покупателей
                    </h1>
                    <div className="mt-4 flex flex-col items-center justify-center">
                        <div className="flex items-center space-x-2 text-yellow-500">
                            {Array(5).fill(0).map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-8 h-8 fill-current ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                            ))}
                        </div>
                        <p className="mt-2 text-3xl font-bold text-gray-800">
                            {averageRating} из 5.0
                        </p>
                        <p className="text-lg text-gray-500 mt-1">
                            На основании {reviews.length} отзывов
                        </p>
                    </div>
                    <button className="mt-6 inline-flex items-center bg-indigo-600 text-white font-medium px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-150 shadow-lg">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Оставить свой отзыв
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                {reviews.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Отзывы пока отсутствуют. Будьте первыми!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;