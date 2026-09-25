-- Dedicated MCPScan records. Do not mix these with other product contacts.
create table if not exists public.mcpscan_quiz_leads (
 submission_id uuid primary key,
 email text not null check (length(email) between 3 and 254),
 answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 5),
 path text not null check (path in ('enterprise','launch','agency','selfServe','inventory')),
 privacy_version text not null,
 source text not null default 'mcpscan-quiz',
 email_verified boolean not null default false,
 receipt_hash text not null unique,
 created_at timestamptz not null default now(),
 review_requested_at timestamptz
);
alter table public.mcpscan_quiz_leads enable row level security;
revoke all on public.mcpscan_quiz_leads from public, anon, authenticated;
grant select, insert, update on public.mcpscan_quiz_leads to service_role;
create table if not exists public.mcpscan_quiz_rate_limits (
 bucket text primary key,
 started_at timestamptz not null default now(),
 requests integer not null default 1
);
alter table public.mcpscan_quiz_rate_limits enable row level security;
revoke all on public.mcpscan_quiz_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.mcpscan_quiz_rate_limits to service_role;
create or replace function public.mcpscan_quiz_throttle(bucket_key text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare request_count integer;
begin
 delete from public.mcpscan_quiz_rate_limits where started_at < now() - interval '2 hours';
 insert into public.mcpscan_quiz_rate_limits (bucket) values (bucket_key)
 on conflict (bucket) do update set requests=public.mcpscan_quiz_rate_limits.requests+1
 returning requests into request_count;
 return request_count <= 40;
end;
$$;
revoke all on function public.mcpscan_quiz_throttle(text) from public, anon, authenticated;
grant execute on function public.mcpscan_quiz_throttle(text) to service_role;
