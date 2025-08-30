alter table if exists public.recommendations
  add column if not exists message text;

alter table if exists public.recommendations
  alter column user_id drop not null;
