create table public.team_admin_audit (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id),
  target_user_id uuid null references auth.users(id),
  target_email text null,
  action text not null check (length(btrim(action)) > 0),
  previous_role public.app_role null,
  new_role public.app_role null,
  success boolean not null,
  error_code text null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  constraint team_admin_audit_success_error check (not success or error_code is null)
);

create index team_admin_audit_created_at_idx on public.team_admin_audit (created_at desc);
create index team_admin_audit_actor_created_idx on public.team_admin_audit (actor_id, created_at desc);
create index team_admin_audit_target_created_idx on public.team_admin_audit (target_user_id, created_at desc);
create index team_admin_audit_action_created_idx on public.team_admin_audit (action, created_at desc);

alter table public.team_admin_audit enable row level security;
alter table public.team_admin_audit force row level security;
revoke all on public.team_admin_audit from public, anon, authenticated;
grant select on public.team_admin_audit to authenticated;
create policy team_admin_audit_owner_read on public.team_admin_audit
  for select to authenticated using (private.is_owner());
-- No browser INSERT/UPDATE/DELETE policy. The Edge Function writes with its
-- server-only service-role client.

