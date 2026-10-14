-- HASH RANKINGS: run this entire file in Supabase Dashboard > SQL Editor > New query > Run.
-- Admin account: t2025358@gmail.com
-- Visitors can read profiles/news and vote. Only the signed-in admin can manage content.
-- Photos are publicly viewable; only the admin can upload/delete them.

create table if not exists public.hash_members (id text primary key, data jsonb not null);
create table if not exists public.hash_news (id text primary key, data jsonb not null);
create table if not exists public.hash_votes (
  voter_id text not null,
  member_id text not null,
  created_at timestamptz not null default now(),
  primary key (voter_id, member_id)
);

alter table public.hash_members enable row level security;
alter table public.hash_news enable row level security;
alter table public.hash_votes enable row level security;

-- API grants: row-level security policies above still control who may write.
grant select on public.hash_members, public.hash_news to anon, authenticated;
grant insert, update, delete on public.hash_members, public.hash_news to authenticated;
grant select on public.hash_votes to anon, authenticated;

drop policy if exists "Public read members" on public.hash_members;
create policy "Public read members" on public.hash_members for select to anon, authenticated using (true);
drop policy if exists "Admin insert members" on public.hash_members;
create policy "Admin insert members" on public.hash_members for insert to authenticated with check ((auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin update members" on public.hash_members;
create policy "Admin update members" on public.hash_members for update to authenticated using ((auth.jwt()->>'email') = 't2025358@gmail.com') with check ((auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin delete members" on public.hash_members;
create policy "Admin delete members" on public.hash_members for delete to authenticated using ((auth.jwt()->>'email') = 't2025358@gmail.com');

drop policy if exists "Public read news" on public.hash_news;
create policy "Public read news" on public.hash_news for select to anon, authenticated using (true);
drop policy if exists "Admin insert news" on public.hash_news;
create policy "Admin insert news" on public.hash_news for insert to authenticated with check ((auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin update news" on public.hash_news;
create policy "Admin update news" on public.hash_news for update to authenticated using ((auth.jwt()->>'email') = 't2025358@gmail.com') with check ((auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin delete news" on public.hash_news;
create policy "Admin delete news" on public.hash_news for delete to authenticated using ((auth.jwt()->>'email') = 't2025358@gmail.com');

drop policy if exists "Read vote records" on public.hash_votes;
create policy "Read vote records" on public.hash_votes for select to anon, authenticated using (true);

create or replace function public.cast_hash_vote(p_member_id text, p_voter_id text)
returns boolean language plpgsql security definer set search_path = public as $$
declare member_data jsonb; current_score integer; inserted_count integer;
begin
  if p_voter_id is null or length(p_voter_id) < 8 or length(p_voter_id) > 100 then return false; end if;
  select data into member_data from public.hash_members where id = p_member_id for update;
  if not found then return false; end if;
  current_score := coalesce((member_data->>'score')::integer, 0);
  if current_score >= 100 then return false; end if;
  insert into public.hash_votes(voter_id, member_id) values (p_voter_id, p_member_id)
    on conflict (voter_id, member_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then return false; end if;
  update public.hash_members set data = jsonb_set(
    jsonb_set(data, '{previousScore}', to_jsonb(current_score), true),
    '{score}', to_jsonb(least(100, current_score + 1)), true
  ) where id = p_member_id;
  return true;
end; $$;
revoke all on function public.cast_hash_vote(text, text) from public;
grant execute on function public.cast_hash_vote(text, text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hash-rankings-photos', 'hash-rankings-photos', true, 1048576, array['image/png','image/jpeg','image/webp','image/gif','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 1048576;

drop policy if exists "Public can view HASH photos" on storage.objects;
create policy "Public can view HASH photos" on storage.objects for select to anon, authenticated using (bucket_id = 'hash-rankings-photos');
drop policy if exists "Admin uploads HASH photos" on storage.objects;
create policy "Admin uploads HASH photos" on storage.objects for insert to authenticated with check (bucket_id = 'hash-rankings-photos' and (auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin updates HASH photos" on storage.objects;
create policy "Admin updates HASH photos" on storage.objects for update to authenticated using (bucket_id = 'hash-rankings-photos' and (auth.jwt()->>'email') = 't2025358@gmail.com') with check (bucket_id = 'hash-rankings-photos' and (auth.jwt()->>'email') = 't2025358@gmail.com');
drop policy if exists "Admin deletes HASH photos" on storage.objects;
create policy "Admin deletes HASH photos" on storage.objects for delete to authenticated using (bucket_id = 'hash-rankings-photos' and (auth.jwt()->>'email') = 't2025358@gmail.com');
