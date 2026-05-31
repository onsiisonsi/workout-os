create table if not exists public.workout_logs (
  id text primary key,
  device_id text not null,
  date date not null,
  day_key text not null,
  day_title text not null,
  payload jsonb not null,
  updated_at timestamptz default now()
);

alter table public.workout_logs enable row level security;

-- Simple MVP policies. For a private production app, replace this with authenticated-user policies.
create policy "device insert" on public.workout_logs
for insert with check (true);

create policy "device update" on public.workout_logs
for update using (true);

create policy "device read" on public.workout_logs
for select using (true);
