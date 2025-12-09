import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

/**
 * GET /api/animals
 * Получить список животных с фильтрацией по категории
 * Query params:
 *   - category?: string (например: 'pets', 'birds')
 */
export async function GET(request: NextRequest) {
  try {
    // Возвращаем пустой массив - AnimalsClient будет использовать fallback данные
    return NextResponse.json([], { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/animals
 * Добавить новое животное в БД (требует Service Role key на сервере)
 * Body:
 *   {
 *     title: string,
 *     description?: string,
 *     price: string,
 *     location: string,
 *     image: string,
 *     category: string
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client не инициализирован' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, description, price, location, image, category } = body;

    if (!title || !price || !location || !image || !category) {
      return NextResponse.json(
        { error: 'Необходимы поля: title, price, location, image, category' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('animals')
      .insert([
        {
          title,
          description,
          price,
          location,
          image,
          category,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('POST API error:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
