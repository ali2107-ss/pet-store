import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey) : null;

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const debug = req.nextUrl.searchParams.get('debug') === '1';
    if (!token) {
      if (debug && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: false, reason: 'no_token', token: null }, { status: 200 });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData, error: userErr } = await (supabaseAdmin.auth as any).getUser(token);
    if (userErr || !userData?.user?.id) {
      if (debug && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: false, reason: 'invalid_token', tokenLength: token.length, userData: userData || null, userErr: userErr || null }, { status: 200 });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user_id = userData.user.id;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Orders GET error', error);
      if (debug && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: false, reason: 'db_error', dbError: error }, { status: 200 });
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    if (debug && process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ ok: true, tokenLength: token.length, user_id, count: (data || []).length, orders: data }, { status: 200 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error('Orders GET exception', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData, error: userErr } = await (supabaseAdmin.auth as any).getUser(token);
    if (userErr || !userData?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user_id = userData.user.id;

    const body = await req.json();
    const { items, total, meta } = body;
    if (!items || !Array.isArray(items)) return NextResponse.json({ error: 'invalid body' }, { status: 400 });

    // создаём запись заказа
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{ user_id, total: total || 0, meta: meta || {}, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (orderError) {
      console.error('Orders POST create order error', orderError);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    const orderId = orderData.id;
    const itemsToInsert = items.map((it: any) => ({
      order_id: orderId,
      product_id: it.id,
      title: it.title,
      price: Number(it.price || 0),
      quantity: it.quantity || 1,
      meta: it.meta || {},
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsToInsert);
    if (itemsError) {
      console.error('Orders POST insert items error', itemsError);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    return NextResponse.json({ order: orderData }, { status: 201 });
  } catch (err) {
    console.error('Orders POST exception', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData, error: userErr } = await (supabaseAdmin.auth as any).getUser(token);
    if (userErr || !userData?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user_id = userData.user.id;

    // получаем id заказов пользователя
    const { data: ordersList, error: fetchErr } = await supabaseAdmin.from('orders').select('id').eq('user_id', user_id);
    if (fetchErr) {
      console.error('Orders DELETE fetch ids error', fetchErr);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }
    const ids = (ordersList || []).map((o: any) => o.id).filter(Boolean);
    let itemsError = null;
    if (ids.length) {
      const itemsRes = await supabaseAdmin.from('order_items').delete().in('order_id', ids);
      itemsError = itemsRes.error;
    }
    // удаляем заказы
    const { error: ordersError } = await supabaseAdmin.from('orders').delete().eq('user_id', user_id);

    if (itemsError || ordersError) {
      console.error('Orders DELETE error', itemsError || ordersError);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Orders DELETE exception', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
