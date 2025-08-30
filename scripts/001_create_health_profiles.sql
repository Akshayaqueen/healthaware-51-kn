create table if not exists public.health_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age int,
  lifestyle text,
  symptoms text[],
  goals text[],
  updated_at timestamptz default now()
);

alter table public.health_profiles enable row level security;

create policy "health_profiles_select_own"
  on public.health_profiles for select
  using (auth.uid() = id);

create policy "health_profiles_insert_own"
  on public.health_profiles for insert
  with check (auth.uid() = id);

create policy "health_profiles_update_own"
  on public.health_profiles for update
  using (auth.uid() = id);

create policy "health_profiles_delete_own"
  on public.health_profiles for delete
  using (auth.uid() = id);
