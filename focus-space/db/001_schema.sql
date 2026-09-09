-- ═══════════════════════════════════════════════════════════════════════
--  FOCUS SPACE — schema
--  مرفأ روّاد الإنجاز
--
--  PostgreSQL 15+ / Supabase. Apply in order:
--      001_schema.sql → 002_functions.sql → 003_policies.sql → 004_seed.sql
--
--  Conventions used throughout:
--    · uuid primary keys, so rows can be created client-side and merged
--    · every human-facing string is i18n_text: {"en": "...", "ar": "..."}
--    · weekday 0 = Sunday, matching the Kuwaiti week and JS getDay()
--    · every table that people write to carries created_at / updated_at
--    · money is numeric(8,2); never floating point
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";
create extension if not exists citext;      -- case-insensitive email
create extension if not exists postgis;     -- distance and "nearest" queries
create extension if not exists pg_trgm;     -- fuzzy search over names

-- ── shared types ───────────────────────────────────────────────────────

-- Bilingual text. English is required; Arabic is added as it is translated.
create domain i18n_text as jsonb
  check (value is null or (jsonb_typeof(value) = 'object' and value ? 'en'));

create type publication_status as enum ('draft', 'published', 'archived');
create type availability_state  as enum ('available', 'busy', 'closed');
create type owner_role          as enum ('owner', 'manager');
create type visit_purpose       as enum ('study', 'work', 'meeting', 'course', 'event', 'other');
create type review_status       as enum ('published', 'hidden', 'removed');
create type message_status      as enum ('new', 'read', 'answered', 'spam');

-- Keeps updated_at honest without the application having to remember.
create or replace function touch_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ═══════════════════════════════════════════════════════════════════════
--  PEOPLE
-- ═══════════════════════════════════════════════════════════════════════

-- A person's public identity: the name and face on a review, and nothing
-- else. Anyone may read this table, which is why nothing private is in it.
-- Not using Supabase? Drop the references clause and manage ids yourself.
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger profiles_touch before update on profiles
  for each row execute function touch_updated_at();

comment on table profiles is 'Public identity of a customer: display name and avatar only.';

-- Everything about a customer that is theirs alone. Split from profiles so
-- that publishing a review never risks publishing a phone number: no policy
-- on this table lets anyone but its owner read a row.
create table profile_private (
  id                  uuid primary key references profiles(id) on delete cascade,
  email               citext,
  phone               text,
  preferred_district  uuid,                       -- fk added after districts
  language            text not null default 'en' check (language in ('en', 'ar')),
  theme               text check (theme in ('light', 'dark')),   -- null = follow device
  notify_offers       boolean not null default false,
  reduce_motion       boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint profile_private_phone_shape check (phone is null or phone ~ '^\+?[0-9 ()-]{6,20}$'),
  constraint profile_private_email_shape check (email is null or email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);
create index profile_private_email_idx on profile_private (email);
create trigger profile_private_touch before update on profile_private
  for each row execute function touch_updated_at();

comment on table profile_private is 'A customer''s contact details and preferences. Readable only by that customer.';

-- ═══════════════════════════════════════════════════════════════════════
--  PLACES
-- ═══════════════════════════════════════════════════════════════════════

create table districts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          i18n_text not null,
  governorate   i18n_text,
  city          i18n_text,
  centre        geography(Point, 4326),           -- for "spaces in Salmiya" maps
  created_at    timestamptz not null default now()
);
create index districts_centre_idx on districts using gist (centre);

alter table profile_private
  add constraint profile_private_district_fk
  foreign key (preferred_district) references districts(id) on delete set null;

-- The three families a space can belong to: offices, halls, cafés.
create table categories (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique check (slug ~ '^[a-z][a-z0-9-]*$'),
  position      smallint not null unique,          -- the 01 / 02 / 03 on screen
  name          i18n_text not null,
  tagline       i18n_text,                         -- "For studying and working"
  description   i18n_text,
  suited_for    jsonb not null default '{"en":[],"ar":[]}'::jsonb,
  created_at    timestamptz not null default now()
);

-- The service vocabulary: wifi, projector, prayer room, and the rest.
create table services (
  key           text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  name          i18n_text not null,
  sort_order    smallint not null default 0,
  icon          text
);

create table spaces (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique check (slug ~ '^[a-z][a-z0-9-]*$'),
  category_id     uuid not null references categories(id) on delete restrict,
  district_id     uuid references districts(id) on delete set null,

  name            i18n_text not null,
  description     i18n_text,
  address         i18n_text,
  location        geography(Point, 4326),
  timezone        text not null default 'Asia/Kuwait',

  capacity        integer check (capacity is null or capacity > 0),
  price_per_hour  numeric(8,2) check (price_per_hour is null or price_per_hour >= 0),
  currency        char(3) not null default 'KWD',

  phone           text,
  website         text,
  booking_url     text,

  status          publication_status not null default 'draft',
  render_seed     smallint,                        -- keeps the 3D fallback stable

  -- maintained by trigger from published reviews; never written by hand
  rating_avg      numeric(2,1),
  review_count    integer not null default 0,

  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  search_doc tsvector generated always as (
    to_tsvector('simple',
      coalesce(name->>'en','') || ' ' || coalesce(name->>'ar','') || ' ' ||
      coalesce(description->>'en','') || ' ' || coalesce(description->>'ar','') || ' ' ||
      coalesce(address->>'en','') || ' ' || coalesce(address->>'ar',''))
  ) stored
);
create index spaces_location_idx  on spaces using gist (location);
create index spaces_search_idx    on spaces using gin (search_doc);
create index spaces_name_trgm_idx on spaces using gin ((name->>'en') gin_trgm_ops);
create index spaces_category_idx  on spaces (category_id) where status = 'published';
create index spaces_district_idx  on spaces (district_id) where status = 'published';
create index spaces_rating_idx    on spaces (rating_avg desc nulls last) where status = 'published';
create trigger spaces_touch before update on spaces
  for each row execute function touch_updated_at();

comment on column spaces.rating_avg is 'Derived from published reviews by trigger. Do not write directly.';

-- Which services a space offers.
create table space_services (
  space_id      uuid not null references spaces(id) on delete cascade,
  service_key   text not null references services(key) on delete cascade,
  primary key (space_id, service_key)
);
create index space_services_service_idx on space_services (service_key);

create table space_images (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid not null references spaces(id) on delete cascade,
  url           text not null,
  alt           i18n_text,
  sort_order    smallint not null default 0,
  is_cover      boolean not null default false,
  uploaded_by   uuid references profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index space_images_space_idx on space_images (space_id, sort_order);
-- At most one cover per space.
create unique index space_images_one_cover_idx on space_images (space_id) where is_cover;

-- ── when a space is open ───────────────────────────────────────────────

-- One row per weekday a space opens. A day with no row is closed that day.
-- A café that runs 16:00 → 02:00 sets closes_next_day.
create table space_hours (
  id              uuid primary key default uuid_generate_v4(),
  space_id        uuid not null references spaces(id) on delete cascade,
  weekday         smallint not null check (weekday between 0 and 6),   -- 0 = Sunday
  opens           time not null,
  closes          time not null,
  closes_next_day boolean not null default false,
  unique (space_id, weekday, opens)
);
create index space_hours_space_idx on space_hours (space_id, weekday);

-- The hours a space is reliably full, so a card can say Busy before someone
-- drives there.
create table space_busy_windows (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid not null references spaces(id) on delete cascade,
  weekday       smallint not null check (weekday between 0 and 6),
  starts        time not null,
  ends          time not null,
  unique (space_id, weekday, starts)
);
create index space_busy_space_idx on space_busy_windows (space_id, weekday);

-- Holidays, Ramadan hours, a one-off shutdown.
create table space_closures (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid not null references spaces(id) on delete cascade,
  closed_on     date not null,
  reason        i18n_text,
  created_at    timestamptz not null default now(),
  unique (space_id, closed_on)
);
create index space_closures_date_idx on space_closures (closed_on);

-- What the venue itself says right now. This is the "live" in live
-- availability: it overrides the timetable until it expires.
create table space_status_overrides (
  space_id      uuid primary key references spaces(id) on delete cascade,
  state         availability_state not null,
  note          i18n_text,
  expires_at    timestamptz,
  updated_by    uuid references profiles(id) on delete set null,
  updated_at    timestamptz not null default now()
);

create table offers (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid not null references spaces(id) on delete cascade,
  title         i18n_text not null,
  terms         i18n_text,
  starts_on     date not null default current_date,
  ends_on       date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint offers_dates check (ends_on is null or ends_on >= starts_on)
);
create index offers_live_idx on offers (space_id) where is_active;
create trigger offers_touch before update on offers
  for each row execute function touch_updated_at();

-- Who may edit a listing and flip its live status.
create table space_owners (
  space_id      uuid not null references spaces(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  role          owner_role not null default 'manager',
  created_at    timestamptz not null default now(),
  primary key (space_id, user_id)
);
create index space_owners_user_idx on space_owners (user_id);

-- ═══════════════════════════════════════════════════════════════════════
--  WHAT PEOPLE DO
-- ═══════════════════════════════════════════════════════════════════════

create table favorites (
  user_id       uuid not null references profiles(id) on delete cascade,
  space_id      uuid not null references spaces(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (user_id, space_id)
);
create index favorites_space_idx on favorites (space_id);

-- Browsing history — "recently viewed" on the profile. Cheap and prunable.
create table space_views (
  id            bigserial primary key,
  user_id       uuid not null references profiles(id) on delete cascade,
  space_id      uuid not null references spaces(id) on delete cascade,
  viewed_at     timestamptz not null default now()
);
create index space_views_recent_idx on space_views (user_id, viewed_at desc);
create index space_views_space_idx  on space_views (space_id, viewed_at desc);

-- An actual visit: someone worked there on a given day. This is the record
-- a review hangs off, and what "the places each customer visits" means.
create table visits (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  space_id      uuid not null references spaces(id) on delete restrict,
  visited_on    date not null default current_date,
  arrived_at    timestamptz,
  left_at       timestamptz,
  party_size    smallint check (party_size is null or party_size > 0),
  purpose       visit_purpose not null default 'work',
  notes         text,
  created_at    timestamptz not null default now(),
  constraint visits_interval check (left_at is null or arrived_at is null or left_at >= arrived_at)
);
create index visits_user_idx  on visits (user_id, visited_on desc);
create index visits_space_idx on visits (space_id, visited_on desc);

-- One review per person per space; editing replaces it.
create table reviews (
  id            uuid primary key default uuid_generate_v4(),
  space_id      uuid not null references spaces(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  visit_id      uuid references visits(id) on delete set null,
  rating        smallint not null check (rating between 1 and 5),
  body          text,
  language      text check (language in ('en', 'ar')),
  status        review_status not null default 'published',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (space_id, user_id)
);
create index reviews_space_idx on reviews (space_id, created_at desc) where status = 'published';
create index reviews_user_idx  on reviews (user_id, created_at desc);
create trigger reviews_touch before update on reviews
  for each row execute function touch_updated_at();

-- ═══════════════════════════════════════════════════════════════════════
--  OPERATIONS
-- ═══════════════════════════════════════════════════════════════════════

-- The Contact Us form. Anyone may write one; only staff may read them.
create table contact_messages (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles(id) on delete set null,
  full_name     text not null check (length(btrim(full_name)) between 2 and 120),
  email         citext not null,
  phone         text,
  subject       text not null check (length(btrim(subject)) between 2 and 200),
  message       text not null check (length(btrim(message)) between 5 and 5000),
  locale        text check (locale in ('en', 'ar')),
  status        message_status not null default 'new',
  handled_by    uuid references profiles(id) on delete set null,
  handled_at    timestamptz,
  created_at    timestamptz not null default now()
);
create index contact_messages_open_idx on contact_messages (created_at desc) where status = 'new';

-- A space someone wants listed, before it becomes a real listing.
create table space_suggestions (
  id            uuid primary key default uuid_generate_v4(),
  suggested_by  uuid references profiles(id) on delete set null,
  name          text not null,
  district      text,
  category_slug text references categories(slug) on delete set null,
  note          text,
  status        message_status not null default 'new',
  created_at    timestamptz not null default now()
);

-- Staff. Membership here is what "admin" means; nothing else grants it.
create table staff (
  user_id       uuid primary key references profiles(id) on delete cascade,
  created_at    timestamptz not null default now()
);
