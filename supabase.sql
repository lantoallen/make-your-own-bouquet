-- Make Your Own Bouquet: Supabase setup
-- Paste this whole file into Supabase -> SQL Editor and run it. It is safe to run again:
-- it creates what is missing and replaces the older, more open policies.
--
-- What it sets up
--   gifts    one row per gift: an id plus the whole bouquet and letter as jsonb
--   replies  receiver replies and "opened" events
-- Visitors can ADD rows, but they cannot list or read the tables. Reading goes through two
-- functions that need a gift id, so a gift can only be opened by someone who has its link.

-- 1. Tables ---------------------------------------------------------------------------------
create table if not exists public.gifts (
  id         text primary key,
  data       jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.replies (
  id         bigint generated always as identity primary key,
  gift_id    text not null,
  kind       text not null default 'reply',
  emoji      text,
  body       text,
  created_at timestamptz not null default now()
);
create index if not exists replies_gift_id_idx on public.replies (gift_id);

-- 2. Row level security: insert only --------------------------------------------------------
alter table public.gifts   enable row level security;
alter table public.replies enable row level security;

drop policy if exists "anyone can create a gift" on public.gifts;
drop policy if exists "anyone can open a gift"   on public.gifts;   -- old: let anyone list every gift
drop policy if exists "anyone can reply"         on public.replies;
drop policy if exists "anyone can read replies"  on public.replies; -- old: let anyone list every reply

create policy "anyone can create a gift" on public.gifts
  for insert to anon
  with check (length(id) between 8 and 40 and octet_length(data::text) < 3000000);

create policy "anyone can reply" on public.replies
  for insert to anon
  with check (
    kind in ('reply', 'opened')
    and length(gift_id) between 8 and 40
    and length(coalesce(body, ''))  <= 500
    and length(coalesce(emoji, '')) <= 24
  );

-- 3. Reading through functions --------------------------------------------------------------
-- get_gift(gid): the gift's data. While its unlock time (data.atu, an ISO UTC timestamp) is still
-- in the future it returns only who it is for and from, never the contents.
create or replace function public.get_gift(gid text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case
           when u.unlock_at is not null and u.unlock_at > now() then
             jsonb_strip_nulls(jsonb_build_object(
               'locked', true,
               'atu',  g.data -> 'atu',
               'at',   g.data -> 'at',
               'to',   g.data -> 'to',
               'from', g.data -> 'from',
               'ev',   g.data -> 'ev'))
           else g.data
         end
  from public.gifts g
  cross join lateral (
    select case
             when g.data ->> 'atu' ~ '^\d{4}-\d\d-\d\dT[0-9:.]+(Z|[+-]\d\d:?\d\d)$'
             then (g.data ->> 'atu')::timestamptz
           end as unlock_at
  ) u
  where g.id = gid;
$$;

-- get_replies(ids): replies and "opened" events for the gift ids a sender passes in.
create or replace function public.get_replies(ids text[])
returns setof public.replies
language sql
stable
security definer
set search_path = public
as $$
  select * from public.replies
  where gift_id = any(ids)
  order by created_at desc
  limit 500;
$$;

revoke all on function public.get_gift(text)      from public;
revoke all on function public.get_replies(text[]) from public;
grant execute on function public.get_gift(text)      to anon, authenticated;
grant execute on function public.get_replies(text[]) to anon, authenticated;

-- Optional housekeeping: remove gifts older than a year.
-- delete from public.gifts where created_at < now() - interval '1 year';
