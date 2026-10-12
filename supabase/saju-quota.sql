-- Standalone setup script; leaves sayeon functions, keys, and quota tables intact.
create table if not exists public.saju_generation_budget (
  singleton boolean primary key default true check (singleton),
  day date not null,
  total integer not null default 0 check (total between 0 and 30),
  clients jsonb not null default '{}'::jsonb
);
alter table public.saju_generation_budget enable row level security;
revoke all on public.saju_generation_budget from public, anon, authenticated;
grant select, insert, update on public.saju_generation_budget to service_role;
insert into public.saju_generation_budget(singleton,day)
values(true,(now() at time zone 'Asia/Seoul')::date) on conflict do nothing;

create or replace function public.saju_reserve_generation(p_client text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  today date := (now() at time zone 'Asia/Seoul')::date;
  b public.saju_generation_budget%rowtype;
  entry jsonb;
  used integer;
  last_call numeric;
  stamp numeric := extract(epoch from clock_timestamp());
begin
  if p_client is null or p_client !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid client';
  end if;
  -- One row lock serializes all reservations, including concurrent requests.
  select * into strict b from public.saju_generation_budget where singleton = true for update;
  if b.day <> today then
    b.day := today; b.total := 0; b.clients := '{}'::jsonb;
  end if;
  entry := b.clients -> p_client;
  used := coalesce((entry ->> 'count')::integer, 0);
  last_call := coalesce((entry ->> 'last')::numeric, 0);
  if b.total >= 30 or used >= 3 or (last_call > 0 and stamp-last_call < 60) then return false; end if;
  update public.saju_generation_budget set
    day=b.day, total=b.total+1,
    clients=jsonb_set(b.clients,array[p_client],jsonb_build_object('count',used+1,'last',stamp),true)
    where singleton=true;
  return true;
end;
$$;
revoke all on function public.saju_reserve_generation(text) from public, anon, authenticated;
grant execute on function public.saju_reserve_generation(text) to service_role;
