import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient'; // Используем админ-клиент для надежности

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content, rating } = body;

    // --- ВАЛИДАЦИЯ (ТО, ЧТО ДЕЛАЕТ БЭКЕНД "ПРОЖАРЕННЫМ") ---
    
    // 1. Проверка на пустоту
    if (!name || !content || !rating) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    // 2. Проверка длины имени
    if (name.length < 2) {
      return NextResponse.json({ error: 'Имя слишком короткое' }, { status: 400 });
    }

    // 3. Проверка текста отзыва (защита от спама)
    if (content.length < 10 || content.length > 500) {
      return NextResponse.json({ error: 'Отзыв должен быть от 10 до 500 символов' }, { status: 400 });
    }

    // 4. Проверка рейтинга (защита от взлома значений)
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Рейтинг должен быть от 1 до 5' }, { status: 400 });
    }

    // --- ЗАПИСЬ В БАЗУ ---
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{ 
        user_name: name, 
        content: content, 
        rating: rating 
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Отзыв успешно добавлен', data }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Ошибка сервера: ' + error.message }, { status: 500 });
  }
}

// Метод GET для получения отзывов через API
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}