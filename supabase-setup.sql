-- HASH RANKINGS Supabase setup
create table if not exists public.hash_members (id text primary key, data jsonb not null);
create table if not exists public.hash_news (id text primary key, data jsonb not null);
create table if not exists public.hash_votes (voter_id text not null, member_id text not null, created_at timestamptz not null default now(), primary key (voter_id, member_id));
