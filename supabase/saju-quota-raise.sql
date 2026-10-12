-- 기존 DB의 일일 한도를 전체 1000회, 브라우저당 50회, 간격 10초로 올린다. SQL 편집기에서 한 번 실행한다.
alter table public.saju_generation_budget drop constraint if exists saju_generation_budget_total_check;
alter table public.saju_generation_budget add constraint saju_generation_budget_total_check check (total between 0 and 1000);

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
  if b.total >= 1000 or used >= 50 or (last_call > 0 and stamp-last_call < 10) then return false; end if;
  update public.saju_generation_budget set
    day=b.day, total=b.total+1,
    clients=jsonb_set(b.clients,array[p_client],jsonb_build_object('count',used+1,'last',stamp),true)
    where singleton=true;
  return true;
end;
$$;
revoke all on function public.saju_reserve_generation(text) from public, anon, authenticated;
grant execute on function public.saju_reserve_generation(text) to service_role;
