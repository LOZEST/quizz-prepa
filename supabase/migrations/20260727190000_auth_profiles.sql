create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

do $$ begin create type public.app_role as enum ('user','admin','owner'); exception when duplicate_object then null; end $$;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 role public.app_role not null default 'user',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function private.current_role() returns public.app_role language sql stable security definer set search_path = pg_catalog, public, auth as $$ select coalesce((select role from public.profiles where id=auth.uid()),'user'::public.app_role) $$;
create or replace function private.is_admin() returns boolean language sql stable security definer set search_path = pg_catalog, public, auth, private as $$ select private.current_role() in ('admin','owner') $$;
create or replace function private.is_owner() returns boolean language sql stable security definer set search_path = pg_catalog, public, auth, private as $$ select private.current_role()='owner' $$;

create or replace function private.create_profile() returns trigger language plpgsql security definer set search_path = pg_catalog, public, auth as $$ begin insert into public.profiles(id,display_name,role) values(new.id,coalesce(new.raw_user_meta_data->>'display_name',split_part(new.email,'@',1)),'user') on conflict(id) do nothing; return new; end $$;

create or replace function private.touch_profile_updated_at() returns trigger language plpgsql security definer set search_path = pg_catalog, public as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function private.touch_profile_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.create_profile();

revoke all on public.profiles from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.current_role() to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_owner() to authenticated;

create policy profiles_read_self on public.profiles for select to authenticated using(id=auth.uid());
create policy profiles_read_moderators on public.profiles for select to authenticated using(private.is_admin());
-- Aucun privilège d’écriture : même owner ne change jamais un rôle depuis le navigateur.
