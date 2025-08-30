create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  input jsonb not null default '{}'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid references public.recommendations(id) on delete cascade,
  liked boolean not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.recommendations enable row level security;
alter table public.recommendation_feedback enable row level security;

-- Permissive temporary policies for anonymous use (to be tightened later)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'recs_select_public') then
    create policy recs_select_public on public.recommendations for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'recs_insert_public') then
    create policy recs_insert_public on public.recommendations for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'recs_fb_select_public') then
    create policy recs_fb_select_public on public.recommendation_feedback for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'recs_fb_insert_public') then
    create policy recs_fb_insert_public on public.recommendation_feedback for insert to anon with check (true);
  end if;
end $$;
