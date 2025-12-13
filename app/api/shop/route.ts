import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

/**
 * GET /api/shop
 * Получить список товаров с фильтрацией по категории
 * Query params:
 *   - category?: string (например: 'Еда', 'Игрушки')
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Ошибка при получении товаров' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/shop
 * Добавить новый товар в БД (требует Service Role key на сервере)
 * Body:
 *   {
 *     name: string,
 *     description?: string,
 *     price: number,
 *     category: string,
 *     image: string,
 *     rating: number,
 *     stock: number
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
    const { name, description, price, category, image, rating, stock } = body;

    if (!name || !price || !category || !image || rating === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Необходимы поля: name, price, category, image, rating, stock' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category,
          image,
          rating,
          stock,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Ошибка при добавлении товара' },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}