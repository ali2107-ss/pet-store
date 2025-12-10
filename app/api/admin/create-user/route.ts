import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Этот файл выполняется только на сервере.
// Требуется добавить в локальный .env: SUPABASE_SERVICE_ROLE_KEY (не коммитить).

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server env');
      return NextResponse.json({ error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL' }, { status: 500 });
    }

    const supabaseAdmin = createClient(url, serviceKey);

    // Создаём пользователя через admin API — он будет подтверждён сразу
    const adminApi: any = (supabaseAdmin.auth as any).admin;
    if (!adminApi || typeof adminApi.createUser !== 'function') {
      console.error('Supabase admin API not available. Check SDK compatibility and service role key.');
      return NextResponse.json({ error: 'Server misconfigured: admin API not available' }, { status: 500 });
    }

    const { data, error } = await adminApi.createUser({
      email,
      password,
      user_metadata: { full_name },
      email_confirm: true,
    });

    if (error) {
      console.error('admin.createUser error', error);
      return NextResponse.json({ error: error.message || 'Create user error' }, { status: 400 });
    }

    // Создаём профиль в таблице profiles (service role обходит RLS)
    try {
      const upsertResult = await supabaseAdmin.from('profiles').upsert({
        id: data.user?.id,
        email,
        full_name,
      });
      if (upsertResult.error) {
        console.warn('profiles upsert warning', upsertResult.error);
      }
    } catch (e) {
      console.warn('profiles upsert threw', e);
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    console.error('create-user route error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
