import { createClient } from '@supabase/supabase-js';

// Клиент для использования в браузере/клиентских запросах
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// Опциональный сервисный клиент (использовать ТОЛЬКО на сервере).
// Требует `SUPABASE_SERVICE_ROLE_KEY` — держите его секретным.
export const supabaseAdmin =
  process.env.SUPABASE_SERVICE_ROLE_KEY && supabaseUrl
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export default supabase;
