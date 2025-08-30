alter table if exists public.comics
  alter column user_id drop not null;

-- optional: ensure recommendation tables also allow null user_id if present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'recommendations' and column_name = 'user_id'
  ) then
    alter table public.recommendations alter column user_id drop not null;
  end if;
end $$;
