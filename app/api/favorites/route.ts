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
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData, error: userErr } = await (supabaseAdmin.auth as any).getUser(token);
    if (userErr || !userData?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user_id = userData.user.id;

    const { data, error } = await supabaseAdmin.from('favorites').select('items').eq('user_id', user_id).limit(1).single();
    if (error && error.code !== 'PGRST116') {
      console.error('Favorites GET error', error);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    return NextResponse.json({ items: data?.items || [] });
  } catch (err) {
    console.error('Favorites GET exception', err);
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
    const { items } = body;

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .upsert({ user_id, items, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Favorites POST error', error);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    return NextResponse.json({ favorites: data }, { status: 200 });
  } catch (err) {
    console.error('Favorites POST exception', err);
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

    const { error } = await supabaseAdmin.from('favorites').delete().eq('user_id', user_id);
    if (error) {
      console.error('Favorites DELETE error', error);
      return NextResponse.json({ error: 'db error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Favorites DELETE exception', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
