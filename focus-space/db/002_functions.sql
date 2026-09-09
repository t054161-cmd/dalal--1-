-- ═══════════════════════════════════════════════════════════════════════
--  FOCUS SPACE — derived data
--
--  Availability, ratings, distance and the one view the space grid reads.
--  Everything the interface currently computes in the browser lives here,
--  so a phone downloading 21 rows and a phone querying 5,000 behave the
--  same way.
-- ═══════════════════════════════════════════════════════════════════════

-- ── who is asking ──────────────────────────────────────────────────────

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where user_id = auth.uid());
$$;

create or replace function is_space_owner(p_space uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from space_owners
     where space_id = p_space and user_id = auth.uid()
  );
$$;

-- ── availability ───────────────────────────────────────────────────────

-- Available / Busy / Closed for a space at a moment, in the space's own
-- timezone. The order matters: a closure beats the timetable, the timetable
-- decides whether the door is open at all, and only then does the venue's
-- own live override — or the usual rush — apply.
create or replace function space_availability(p_space uuid, p_at timestamptz default now())
returns availability_state
language plpgsql stable as $$
declare
  tz          text;
  local_ts    timestamp;
  local_date  date;
  local_time  time;
  dow         smallint;
  prev_dow    smallint;
  open_now    boolean;
  override    space_status_overrides%rowtype;
begin
  select timezone into tz from spaces where id = p_space;
  if tz is null then
    return null;                      -- no such space
  end if;

  local_ts   := p_at at time zone tz;
  local_date := local_ts::date;
  local_time := local_ts::time;
  dow        := extract(dow from local_date)::smallint;   -- 0 = Sunday
  prev_dow   := (dow + 6) % 7;

  -- 1 · a holiday or one-off shutdown
  if exists (
    select 1 from space_closures c
     where c.space_id = p_space and c.closed_on = local_date
  ) then
    return 'closed';
  end if;

  -- 2 · is the door open? today's window, or last night's that runs past midnight
  select true into open_now
    from space_hours h
   where h.space_id = p_space
     and (
          (h.weekday = dow      and not h.closes_next_day
             and local_time >= h.opens and local_time < h.closes)
       or (h.weekday = dow      and h.closes_next_day and local_time >= h.opens)
       or (h.weekday = prev_dow and h.closes_next_day and local_time <  h.closes)
     )
   limit 1;

  if not coalesce(open_now, false) then
    return 'closed';
  end if;

  -- 3 · what the venue says right now, while it is still fresh
  select * into override
    from space_status_overrides o
   where o.space_id = p_space
     and (o.expires_at is null or o.expires_at > p_at);
  if found then
    return override.state;
  end if;

  -- 4 · the hours it is reliably full. A window whose end is at or before
  --     its start runs past midnight, exactly like the opening hours above.
  if exists (
    select 1 from space_busy_windows b
     where b.space_id = p_space
       and (
            (b.weekday = dow      and b.ends >  b.starts
               and local_time >= b.starts and local_time < b.ends)
         or (b.weekday = dow      and b.ends <= b.starts and local_time >= b.starts)
         or (b.weekday = prev_dow and b.ends <= b.starts and local_time <  b.ends)
       )
  ) then
    return 'busy';
  end if;

  return 'available';
end;
$$;

comment on function space_availability is
  'Available / Busy / Closed for a space at a moment, in that space''s timezone.';

-- ── ratings ────────────────────────────────────────────────────────────

-- The headline rating is never typed in; it is the average of published
-- reviews, recomputed whenever one lands.
create or replace function recompute_space_rating(p_space uuid) returns void
language sql as $$
  update spaces s
     set rating_avg   = agg.avg_rating,
         review_count = agg.n
    from (
      select round(avg(rating)::numeric, 1) as avg_rating,
             count(*)::int                  as n
        from reviews
       where space_id = p_space and status = 'published'
    ) agg
   where s.id = p_space;
$$;

create or replace function reviews_refresh_rating() returns trigger
language plpgsql as $$
begin
  if tg_op in ('INSERT', 'UPDATE') then
    perform recompute_space_rating(new.space_id);
  end if;
  if tg_op in ('UPDATE', 'DELETE') and
     (tg_op = 'DELETE' or new.space_id is distinct from old.space_id) then
    perform recompute_space_rating(old.space_id);
  end if;
  return null;
end;
$$;

create trigger reviews_rating_aggregate
after insert or update or delete on reviews
for each row execute function reviews_refresh_rating();

-- ── distance ───────────────────────────────────────────────────────────

-- "Nearest" as a real query. The browser sends one point and gets back an
-- ordered list, instead of downloading every space and sorting them itself.
create or replace function spaces_near(
  p_lat        double precision,
  p_lng        double precision,
  p_radius_km  double precision default 25
)
returns table (space_id uuid, distance_km double precision)
language sql stable as $$
  select s.id,
         st_distance(s.location, st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography) / 1000.0
    from spaces s
   where s.status = 'published'
     and s.location is not null
     and st_dwithin(s.location,
                    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography,
                    p_radius_km * 1000)
   order by 2;
$$;

-- ── the grid ───────────────────────────────────────────────────────────

-- Everything a space card shows, in one row per space.
create or replace view space_cards
with (security_invoker = true) as
select
  s.id,
  s.slug,
  s.name,
  s.description,
  s.capacity,
  s.price_per_hour,
  s.currency,
  s.rating_avg,
  s.review_count,
  s.render_seed,
  c.slug        as category_slug,
  c.name        as category_name,
  c.position    as category_position,
  d.slug        as district_slug,
  d.name        as district_name,
  st_y(s.location::geometry) as lat,
  st_x(s.location::geometry) as lng,
  space_availability(s.id)   as availability,
  (select i.url
     from space_images i
    where i.space_id = s.id
    order by i.is_cover desc, i.sort_order
    limit 1)                 as cover_url,
  coalesce((
    select array_agg(ss.service_key order by sv.sort_order)
      from space_services ss
      join services sv on sv.key = ss.service_key
     where ss.space_id = s.id
  ), '{}'::text[])           as services,
  (select jsonb_agg(jsonb_build_object('id', o.id, 'title', o.title, 'terms', o.terms))
     from offers o
    where o.space_id = s.id
      and o.is_active
      and o.starts_on <= current_date
      and (o.ends_on is null or o.ends_on >= current_date)
  )                          as offers
from spaces s
join categories c on c.id = s.category_id
left join districts d on d.id = s.district_id
where s.status = 'published';

comment on view space_cards is 'One row per published space with everything a card renders.';
