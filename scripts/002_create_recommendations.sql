create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input jsonb not null,
  suggestions jsonb not null,
  created_at timestamptz default now()
);

alter table public.recommendations enable row level security;

create policy "recommendations_select_own"
  on public.recommendations for select
  using (auth.uid() = user_id);

create policy "recommendations_insert_own"
  on public.recommendations for insert
  with check (auth.uid() = user_id);

create policy "recommendations_delete_own"
  on public.recommendations for delete
  using (auth.uid() = user_id);
