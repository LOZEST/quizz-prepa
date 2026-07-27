-- Banque de questions : appliquer après les migrations profils et progression.
do $$ begin create type public.question_scope as enum ('private','common'); exception when duplicate_object then null; end $$;
do $$ begin create type public.question_status as enum ('draft','published','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.question_type as enum ('course','formula','parameterized'); exception when duplicate_object then null; end $$;

create table if not exists public.questions (
 id uuid primary key default gen_random_uuid(), author_id uuid not null references auth.users(id) on delete cascade,
 scope public.question_scope not null, status public.question_status not null default 'draft', question_type public.question_type not null,
 title text not null, part_id text not null, chapter_id text not null, notion_id text not null, difficulty integer not null,
 category text, prompt_content jsonb not null, hint_content jsonb, correction_content jsonb not null,
 hidden_concept_content jsonb, oral_formulation_content jsonb, variable_spec jsonb, tags text[] not null default '{}',
 version integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 published_at timestamptz, archived_at timestamptz,
 constraint questions_difficulty check (difficulty between 1 and 4), constraint questions_title check (btrim(title) <> ''),
 constraint questions_taxonomy check (btrim(part_id) <> '' and btrim(chapter_id) <> '' and btrim(notion_id) <> ''),
 constraint questions_prompt_object check (jsonb_typeof(prompt_content)='object'),
 constraint questions_correction_object check (jsonb_typeof(correction_content)='object'),
 constraint questions_variables check ((question_type='parameterized' and jsonb_typeof(variable_spec)='object') or (question_type<>'parameterized' and variable_spec is null)),
 constraint questions_dates check ((status<>'published' or published_at is not null) and (status<>'archived' or archived_at is not null)),
 constraint questions_version check (version >= 1)
);
create index if not exists questions_common_published_idx on public.questions(updated_at desc) where scope='common' and status='published';
create index if not exists questions_author_idx on public.questions(author_id,updated_at desc);
create index if not exists questions_notion_idx on public.questions(notion_id);
create index if not exists questions_chapter_idx on public.questions(chapter_id);
create index if not exists questions_updated_idx on public.questions(updated_at);
create index if not exists questions_scope_status_notion_idx on public.questions(scope,status,notion_id);

create or replace function private.prepare_question_write() returns trigger language plpgsql security definer set search_path=pg_catalog,public,private as $$
begin
 if tg_op='UPDATE' then
  if new.author_id<>old.author_id or new.scope<>old.scope or new.created_at<>old.created_at then raise exception 'immutable question ownership'; end if;
  if old.status='archived' and new.status='published' then raise exception 'duplicate archived question into a new draft'; end if;
  if new is not distinct from old then return old; end if;
  new.version:=old.version+1; new.updated_at:=now();
 end if;
 if new.status='published' and new.published_at is null then new.published_at:=now(); end if;
 if new.status='archived' and new.archived_at is null then new.archived_at:=now(); end if;
 return new;
end $$;
drop trigger if exists questions_prepare_write on public.questions;
create trigger questions_prepare_write before insert or update on public.questions for each row execute function private.prepare_question_write();

alter table public.questions enable row level security;
alter table public.questions force row level security;
drop policy if exists questions_select on public.questions;
create policy questions_select on public.questions for select to authenticated using (
 (scope='common' and (status='published' or private.is_admin() or private.is_owner())) or (scope='private' and author_id=auth.uid()));
drop policy if exists questions_insert on public.questions;
create policy questions_insert on public.questions for insert to authenticated with check (
 author_id=auth.uid() and (scope='private' or (scope='common' and (private.is_admin() or private.is_owner()))));
drop policy if exists questions_update on public.questions;
create policy questions_update on public.questions for update to authenticated using (
 (scope='private' and author_id=auth.uid()) or (scope='common' and (private.is_admin() or private.is_owner()))) with check (
 (scope='private' and author_id=auth.uid()) or (scope='common' and (private.is_admin() or private.is_owner())));
revoke all on public.questions from anon,authenticated;
grant select,insert,update on public.questions to authenticated;
revoke delete on public.questions from authenticated;
