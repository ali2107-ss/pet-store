import { createClient } from '@supabase/supabase-js';

// Клиент для использования в браузере/клиентских запросах
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Если переменные окружения не заданы (локально/еще не настроено),
// экспортируем «noop» объект, чтобы импорт не падал и серверные рутины могли работать.
const noopClient = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    updateUser: async () => ({ data: null, error: new Error('Supabase not configured') }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: new Error('Supabase not configured') }),
  },
  from: () => ({ select: async () => ({ data: [], error: null }) }),
};

let _supabase: any = noopClient;
let _supabaseAdmin: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true },
    });
  } else {
    console.warn('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase client will be a noop.');
  }
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e);
  _supabase = noopClient;
}

// Опциональный сервисный клиент (использовать ТОЛЬКО на сервере).
// Требует `SUPABASE_SERVICE_ROLE_KEY` — держите его секретным.
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseUrl) {
    _supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
} catch (e) {
  console.warn('Failed to initialize Supabase admin client:', e);
  _supabaseAdmin = null;
}

export const supabase = _supabase;
export const supabaseAdmin = _supabaseAdmin;

export default supabase;
