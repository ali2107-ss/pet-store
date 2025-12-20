const { createClient } = require('@supabase/supabase-js');

// Запуск:
// PowerShell:
// $env:NEXT_PUBLIC_SUPABASE_URL="https://..."; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="..."; $env:SUPABASE_SERVICE_ROLE_KEY="..."; node scripts/check_supabase.js

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('NEXT_PUBLIC_SUPABASE_URL:', !!url);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!anon);
console.log('SUPABASE_SERVICE_ROLE_KEY:', !!service);

try {
  if (url && anon) {
    const client = createClient(url, anon);
    console.log('Anon client created. Auth methods available:', typeof client.auth.getSession === 'function');
  }
  if (url && service) {
    const admin = createClient(url, service);
    console.log('Admin client created. From function available:', typeof admin.from === 'function');
  }
} catch (e) {
  console.error('Error creating client:', e.message || e);
}
