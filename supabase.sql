   -- Reference copy of the Supabase setup. Run each part once in Supabase -> SQL Editor.
   -- Do not re-run parts that already exist; it will say "already exists".

   -- 1. Gifts
   create table gifts (id text primary key, data jsonb not null, created_at timestamptz default now());
   alter table gifts enable row level security;
   create policy "anyone can create a gift" on gifts for insert to anon with check (true);
   create policy "anyone can open a gift"   on gifts for select to anon using (true);

   -- 2. Replies and "opened" tracking
   create table replies (id bigint generated always as identity primary key, gift_id text not null, kind text not null default 'reply', emoji text, body text, created_at timestamptz default now());
   alter table replies enable row level security;
   create policy "anyone can reply" on replies for insert to anon with check (true);
   create policy "anyone can read replies" on replies for select to anon using (true);