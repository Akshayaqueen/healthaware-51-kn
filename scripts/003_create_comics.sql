create table if not exists public.comics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.comic_panels (
  id uuid primary key default gen_random_uuid(),
  comic_id uuid not null references public.comics(id) on delete cascade,
  panel_index int not null,
  panel_text text,
  image_url text,
  created_at timestamptz default now(),
  unique (comic_id, panel_index)
);

alter table public.comics enable row level security;
alter table public.comic_panels enable row level security;

create policy "comics_select_own"
  on public.comics for select
  using (auth.uid() = user_id);

create policy "comics_insert_own"
  on public.comics for insert
  with check (auth.uid() = user_id);

create policy "comics_delete_own"
  on public.comics for delete
  using (auth.uid() = user_id);

create policy "comic_panels_select_own"
  on public.comic_panels for select
  using (exists (
    select 1 from public.comics c
    where c.id = comic_id and c.user_id = auth.uid()
  ));

create policy "comic_panels_insert_own"
  on public.comic_panels for insert
  with check (exists (
    select 1 from public.comics c
    where c.id = comic_id and c.user_id = auth.uid()
  ));

create policy "comic_panels_delete_own"
  on public.comic_panels for delete
  using (exists (
    select 1 from public.comics c
    where c.id = comic_id and c.user_id = auth.uid()
  ));
