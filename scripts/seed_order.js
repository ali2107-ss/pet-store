const { createClient } = require('@supabase/supabase-js');

// Usage:
// SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed_order.js <user_id>

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const userId = process.argv[2];
if (!userId) {
  console.error('Provide user id as first argument: node scripts/seed_order.js <user_id>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function run() {
  try {
    const order = {
      user_id: userId,
      total: 12345,
      meta: { created_by: 'seed' },
      created_at: new Date().toISOString(),
    };

    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([order]).select().single();
    if (orderErr) throw orderErr;

    const items = [
      { order_id: orderData.id, product_id: 1, title: 'Test item', price: 12345, quantity: 1, meta: {} },
    ];

    const { error: itemsErr } = await supabase.from('order_items').insert(items);
    if (itemsErr) throw itemsErr;

    console.log('Seeded order id=', orderData.id);
  } catch (e) {
    console.error('Seed error', e);
    process.exit(1);
  }
}

run();
