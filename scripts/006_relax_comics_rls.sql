-- assumes tables public.comics and public.comic_panels exist
alter table if exists public.comics enable row level security;
alter table if exists public.comic_panels enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'comics_insert_public') then
    create policy comics_insert_public on public.comics for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'panels_insert_public') then
    create policy panels_insert_public on public.comic_panels for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'comics_select_public') then
    create policy comics_select_public on public.comics for select to anon using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'panels_select_public') then
    create policy panels_select_public on public.comic_panels for select to anon using (true);
  end if;
end $$;
