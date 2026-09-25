-- Anonymous MCPScan funnel events. No email or free text. Joined to leads only by path, never by person.
create table if not exists public.mcpscan_quiz_events (
 id bigint generated always as identity primary key,
 event text not null check (event in ('page_viewed','quiz_started','question_completed','lead_gate_viewed','lead_submit_started','lead_captured','lead_capture_failed','artifact_viewed','artifact_downloaded','artifact_printed','review_requested','review_request_failed','offer_clicked')),
 session_id uuid not null,
 path text check (path in ('enterprise','launch','agency','selfServe','inventory')),
 step smallint,
 created_at timestamptz not null default now()
);
create index if not exists mcpscan_quiz_events_created_idx on public.mcpscan_quiz_events (created_at);
alter table public.mcpscan_quiz_events enable row level security;
revoke all on public.mcpscan_quiz_events from public, anon, authenticated;
grant select, insert on public.mcpscan_quiz_events to service_role;
grant usage, select on sequence public.mcpscan_quiz_events_id_seq to service_role;
-- Founder funnel view: unique sessions per step, last 30 days.
create or replace view public.mcpscan_quiz_funnel_30d with (security_invoker = true) as
select event, count(distinct session_id) as sessions, count(*) as events
from public.mcpscan_quiz_events where created_at > now() - interval '30 days'
group by event;
revoke all on public.mcpscan_quiz_funnel_30d from public, anon, authenticated;
grant select on public.mcpscan_quiz_funnel_30d to service_role;
