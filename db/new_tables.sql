-- Новые таблицы для адресов и способов оплаты
-- Выполните этот SQL отдельно, если основной файл вызывает ошибки

-- 5) Таблица адресов доставки
CREATE TABLE IF NOT EXISTS user_addresses (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL, -- например, "Дом", "Работа"
  address text NOT NULL,
  city text,
  postal_code text,
  country text DEFAULT 'Казахстан',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6) Таблица способов оплаты
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'card', -- 'card', 'paypal', etc.
  card_number_masked text, -- последние 4 цифры, например ****4242
  card_brand text, -- Visa, Mastercard
  expiry_month int,
  expiry_year int,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Индексы для новых таблиц
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);

-- Связи с profiles
ALTER TABLE user_addresses
  DROP CONSTRAINT IF EXISTS fk_user_addresses_user_profiles;
ALTER TABLE user_addresses
  ADD CONSTRAINT fk_user_addresses_user_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_payment_methods
  DROP CONSTRAINT IF EXISTS fk_user_payment_methods_user_profiles;
ALTER TABLE user_payment_methods
  ADD CONSTRAINT fk_user_payment_methods_user_profiles FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- RLS для user_addresses
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_manage_own_addresses" ON user_addresses;
CREATE POLICY "users_manage_own_addresses"
  ON user_addresses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS для user_payment_methods
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_manage_own_payment_methods" ON user_payment_methods;
CREATE POLICY "users_manage_own_payment_methods"
  ON user_payment_methods
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);