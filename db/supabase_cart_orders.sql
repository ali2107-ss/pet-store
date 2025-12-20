-- SQL для Supabase: таблицы корзины и истории заказов
-- Запустить в SQL Editor Supabase для вашего проекта.

-- 1) Таблица корзин (одна корзина на пользователя)
CREATE TABLE IF NOT EXISTS carts (
  user_id uuid PRIMARY KEY,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 2) Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  total numeric(12,2) DEFAULT 0,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 3) Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id int,
  title text,
  price numeric(12,2),
  quantity int DEFAULT 1,
  meta jsonb DEFAULT '{}'::jsonb
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4) Таблица избранного
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid PRIMARY KEY,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

ALTER TABLE favorites
  DROP CONSTRAINT IF EXISTS fk_favorites_user_profiles;
ALTER TABLE favorites
  ADD CONSTRAINT fk_favorites_user_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Связи с существующими таблицами (profiles, products)
-- Удаляем старые ограничения, если они есть, затем добавляем внешние ключи
ALTER TABLE carts
  DROP CONSTRAINT IF EXISTS fk_carts_user_profiles;
ALTER TABLE carts
  ADD CONSTRAINT fk_carts_user_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS fk_orders_user_profiles;
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_user_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS fk_order_items_product_products;
ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_product_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- Включаем RLS для favorites и создаём политику
ALTER TABLE IF EXISTS favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_manage_own_favorites" ON favorites;
CREATE POLICY "users_manage_own_favorites"
  ON favorites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- Пример RLS (Row Level Security).
-- Предполагается, что в таблице profiles.id хранится auth.uid() (uuid),
-- и что вы используете Supabase Auth. Проверьте соответствие с вашей схемой.

-- Включаем RLS
ALTER TABLE IF EXISTS carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

-- Политика: пользователь может читать/заменять свою корзину
DROP POLICY IF EXISTS "users_manage_own_cart" ON carts;
CREATE POLICY "users_manage_own_cart"
  ON carts
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политика: пользователь видит свои заказы
DROP POLICY IF EXISTS "users_select_own_orders" ON orders;
CREATE POLICY "users_select_own_orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Политика: при создании заказа — пользователь создает запись с своим user_id
DROP POLICY IF EXISTS "users_insert_own_orders" ON orders;
CREATE POLICY "users_insert_own_orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Политики для order_items (чтение связанных позиций заказов)
DROP POLICY IF EXISTS "users_select_order_items_via_order" ON order_items;
CREATE POLICY "users_select_order_items_via_order"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Примечание:
-- 1) Для операций, которые выполняются сервером (API с service role key),
--    RLS не применяется (service role обходит ограничения). Поэтому
--    ваши серверные роуты /api/cart и /api/orders, использующие service role,
--    могут выполнять upsert/delete без дополнительных прав.
-- 2) Если вы хотите, чтобы серверные роуты использовали аутентификацию клиента,
--    не передавайте user_id в теле и вместо этого проверяйте session через
--    Supabase клиент на сервере (recommended) или используйте JWT.

-- Пример: добавить колонку updated_by если нужно отслеживать кто обновил
-- ALTER TABLE carts ADD COLUMN IF NOT EXISTS updated_by uuid;

-- Конец файла
