create table if not exists profiles (
  id uuid primary key,
  email text not null,
  created_at timestamptz default now()
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  checkin_date date not null,
  did_complete boolean not null,
  note text,
  created_at timestamptz default now(),
  unique (user_id, checkin_date)
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table checkins enable row level security;
alter table subscriptions enable row level security;

create policy "users manage own profile" on profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "users manage own checkins" on checkins
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users read own subscription" on subscriptions
for select using (auth.uid() = user_id);
