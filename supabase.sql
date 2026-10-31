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

-- del_hash: SHA-256 of a secret delete code that only the sender's browser keeps. get_gift never returns it.
alter table public.gifts add column if not exists del_hash text;

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
  with check (length(id) between 8 and 40 and octet_length(data::text) < 3000000
              and (del_hash is null or del_hash ~ '^[0-9a-f]{64}$'));

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

-- 4. Abuse protection -----------------------------------------------------------------------
-- Visitors can add rows without signing in, so cap how fast the tables can grow: at most 60 new
-- gifts and 240 replies/"opened" events in any one minute across the whole site. Real use is far
-- below that. The app shows a friendly "try again in a minute" message if it is ever hit.
create index if not exists gifts_created_at_idx   on public.gifts   (created_at);
create index if not exists replies_created_at_idx on public.replies (created_at);

create or replace function public.throttle_inserts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  max_per_minute int := tg_argv[0]::int;
  recent int;
begin
  execute format('select count(*) from %I.%I where created_at > now() - interval ''1 minute''',
                 tg_table_schema, tg_table_name) into recent;
  if recent >= max_per_minute then
    raise exception 'Too many requests, please try again in a minute' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists gifts_throttle   on public.gifts;
drop trigger if exists replies_throttle on public.replies;
create trigger gifts_throttle   before insert on public.gifts   for each row execute function public.throttle_inserts(60);
create trigger replies_throttle before insert on public.replies for each row execute function public.throttle_inserts(240);

-- 5. Housekeeping ---------------------------------------------------------------------------
-- delete_old_gifts(): removes gifts (and their replies) older than the given age. Only the project
-- owner can run it; visitors cannot. To run it automatically every night, enable the pg_cron
-- extension (Database -> Extensions) and uncomment the schedule below.
create or replace function public.delete_old_gifts(older_than interval default interval '1 year')
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  with gone as (
    delete from public.gifts where created_at < now() - older_than returning id
  ), gone_replies as (
    delete from public.replies where gift_id in (select id from gone) returning 1
  )
  select count(*) into n from gone;
  return n;
end;
$$;
revoke all on function public.delete_old_gifts(interval) from public, anon, authenticated;

-- select cron.schedule('delete-old-gifts', '17 3 * * *', $$ select public.delete_old_gifts(interval '1 year') $$);

-- 6. Senders can delete their own gifts ---------------------------------------------------------
-- delete_gift(gid, code): removes the gift and its replies when the code matches the stored hash.
-- Returns true if something was deleted. Without the code nobody can delete a gift.
create or replace function public.delete_gift(gid text, code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ok boolean;
begin
  delete from public.gifts
   where id = gid
     and del_hash is not null
     and del_hash = encode(sha256(convert_to(code, 'UTF8')), 'hex');
  ok := found;
  if ok then
    delete from public.replies where gift_id = gid;
  end if;
  return ok;
end;
$$;
revoke all on function public.delete_gift(text, text) from public;
grant execute on function public.delete_gift(text, text) to anon, authenticated;
