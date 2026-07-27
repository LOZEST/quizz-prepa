create table public.progress_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  event_version integer not null,
  event_type text not null,
  notion_id text,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null,
  source_device_id text,
  event_payload jsonb not null,
  server_seq bigint generated always as identity,
  server_created_at timestamptz not null default now(),
  primary key (user_id, event_id),
  constraint progress_events_payload_object check (jsonb_typeof(event_payload) = 'object'),
  constraint progress_events_payload_identity check (
    event_payload ->> 'id' = event_id and event_payload ->> 'eventType' = event_type
  )
);

create index progress_events_user_seq_idx on public.progress_events (user_id, server_seq);
alter table public.progress_events enable row level security;
revoke all on table public.progress_events from anon, authenticated;
grant select, insert on table public.progress_events to authenticated;
grant usage, select on sequence public.progress_events_server_seq_seq to authenticated;

create policy "users read their progress events"
on public.progress_events for select to authenticated
using (user_id = (select auth.uid()));

create policy "users append their progress events"
on public.progress_events for insert to authenticated
with check (user_id = (select auth.uid()));

