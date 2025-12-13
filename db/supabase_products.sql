-- Создание таблицы для товаров в магазине
create table public.products (
  id bigserial primary key,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image text not null,
  rating numeric(2,1) default 0,
  stock integer default 0,
  created_at timestamptz default now()
);

-- Включение RLS (Row Level Security)
alter table public.products enable row level security;

-- Политика для чтения товаров (доступно всем)
create policy "Products are viewable by everyone" on public.products
  for select using (true);

-- Политика для вставки товаров (только аутентифицированные пользователи или админ)
create policy "Authenticated users can insert products" on public.products
  for insert with check (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Политика для обновления товаров (только аутентифицированные пользователи или админ)
create policy "Authenticated users can update products" on public.products
  for update using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Политика для удаления товаров (только аутентифицированные пользователи или админ)
create policy "Authenticated users can delete products" on public.products
  for delete using (auth.role() = 'authenticated' or auth.role() = 'service_role');