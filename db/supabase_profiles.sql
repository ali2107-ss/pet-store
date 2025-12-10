-- Создает таблицу profiles и триггер для автоматического создания профиля при создании пользователя
-- Выполните этот SQL в Supabase → SQL Editor

-- 1) Таблица профилей
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2) Функция для создания профиля при регистрации через auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, created_at)
  values (new.id, new.email, (new.user_metadata->>'full_name')::text, timezone('utc'::text, now()))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 3) Триггер при вставке в auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 4) Включаем RLS и политики для таблицы profiles
-- В SQL Editor Supabase выполните следующие команды (или через GUI):
alter table public.profiles enable row level security;

-- Политика: позволить аутентифицированным пользователям читать свои профильные строки
create policy "Profiles: select own" on public.profiles
for select using (auth.role() = 'authenticated' and auth.uid() = id);

-- Политика: позволить аутентифицированным пользователям вставлять свой профиль (обычно триггер уже вставляет)
create policy "Profiles: insert own" on public.profiles
for insert with check (auth.role() = 'authenticated' and auth.uid() = id);

-- Политика: позволить пользователю обновлять только свой профиль
create policy "Profiles: update own" on public.profiles
for update using (auth.role() = 'authenticated' and auth.uid() = id)
with check (auth.role() = 'authenticated' and auth.uid() = id);

-- Политика: позволить пользователю удалять только свой профиль (по желанию)
create policy "Profiles: delete own" on public.profiles
for delete using (auth.role() = 'authenticated' and auth.uid() = id);

-- Примечание: Если у вас уже включены политики или части кода, скорректируйте SQL соответственно.
