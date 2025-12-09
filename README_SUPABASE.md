Supabase — быстрая настройка базы данных для проекта
=================================================

Короткая инструкция (на русском) как добавить Supabase в этот проект:

1) Создать проект в Supabase
   - Перейдите на https://app.supabase.com и создайте новый проект.
   - Сохраните `Project URL` и `anon` ключ (Public anon key).
   - Опционально получите `Service Role` key для серверных операций.

2) Настроить таблицы (пример SQL)
   - Веб-интерфейс Supabase → SQL → New query.
   - Пример для таблицы `animals`:

```sql
create table public.animals (
  id bigserial primary key,
  title text not null,
  description text,
  price text,
  location text,
  image text,
  category text,
  created_at timestamptz default now()
);
```

3) Добавить переменные окружения
   - Для локальной разработки скопируйте `.env.local.example` в `.env.local` и заполните значения.
   - Для деплоя (Vercel/GitHub Actions) добавьте `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Если используете серверные задачи (cron, import/export), добавьте секрет `SUPABASE_SERVICE_ROLE_KEY` в защищённые secrets.

4) Интеграция в код
   - В проект уже добавлен `lib/supabaseClient.ts`.
   - Пример использования на сервере (Next.js Server Component / API route):

```ts
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase
  .from('animals')
  .select('*')
  .order('created_at', { ascending: false });
```

5) GitHub / совместная работа
   - В GitHub репозитории добавьте секреты (Settings → Secrets) с теми же именами.
   - Не добавляйте `SUPABASE_SERVICE_ROLE_KEY` в публичные файлы.

6) Дополнительно
   - Если нужно — могу создать миграции SQL или пример API-роуты для CRUD.
