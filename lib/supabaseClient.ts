import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Добавляем настройки auth, чтобы убрать ошибку AuthSessionMissingError
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,       // Не сохранять сессию в localStorage
    autoRefreshToken: false,    // Не обновлять токены автоматически
    detectSessionInUrl: false   // Не искать токены в URL
  }
});