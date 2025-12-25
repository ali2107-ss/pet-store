import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  // Объявляем startTime в самом начале функции, чтобы он был доступен везде
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { name, content, rating } = body;

    console.log(`[POST] /api/reviews - Request received from: ${name}`);

    // --- 1. ВАЛИДАЦИЯ ДАННЫХ ---
    if (!name || !content || !rating) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    if (content.length < 10) {
      return NextResponse.json({ error: 'Отзыв слишком короткий (минимум 10 символов)' }, { status: 400 });
    }

    // --- 2. ЗАЩИТА ОТ ДУБЛИКАТОВ (АНТИ-СПАМ) ---
    const { data: existingReview } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('user_name', name)
      .eq('content', content)
      .maybeSingle(); // Используем maybeSingle, чтобы не было ошибки, если ничего не найдено

    if (existingReview) {
      return NextResponse.json(
        { error: 'Вы уже оставили точно такой же отзыв!' }, 
        { status: 400 }
      );
    }

    // --- 3. ЗАПИСЬ В БАЗУ ---
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{ 
        user_name: name, 
        content: content, 
        rating: rating 
      }])
      .select();

    if (error) {
      console.error(`[DATABASE ERROR] ${error.message}`);
      return NextResponse.json({ error: 'Ошибка базы данных' }, { status: 500 });
    }

    // Теперь startTime точно доступен здесь
    const duration = Date.now() - startTime;
    console.log(`[SUCCESS] Review created in ${duration}ms`);

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error: any) {
    console.error(`[SERVER CRASH] ${error.message}`);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: 'Ошибка при получении данных' }, { status: 500 });
  }
}