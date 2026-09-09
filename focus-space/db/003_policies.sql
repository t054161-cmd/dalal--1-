-- ═══════════════════════════════════════════════════════════════════════
--  FOCUS SPACE — row level security
--
--  The rule of the house: listings are public, people's own data is theirs
--  alone, a venue's owner maintains that venue, and staff clean up after
--  everyone. Nothing here depends on the client behaving well.
-- ═══════════════════════════════════════════════════════════════════════

alter table profiles               enable row level security;
alter table profile_private        enable row level security;
alter table districts              enable row level security;
alter table categories             enable row level security;
alter table services               enable row level security;
alter table spaces                 enable row level security;
alter table space_services         enable row level security;
alter table space_images           enable row level security;
alter table space_hours            enable row level security;
alter table space_busy_windows     enable row level security;
alter table space_closures         enable row level security;
alter table space_status_overrides enable row level security;
alter table offers                 enable row level security;
alter table space_owners           enable row level security;
alter table favorites              enable row level security;
alter table space_views            enable row level security;
alter table visits                 enable row level security;
alter table reviews                enable row level security;
alter table contact_messages       enable row level security;
alter table space_suggestions      enable row level security;
alter table staff                  enable row level security;

-- ── the catalogue is public ────────────────────────────────────────────

create policy districts_read  on districts  for select using (true);
create policy categories_read on categories for select using (true);
create policy services_read   on services   for select using (true);

create policy spaces_read on spaces for select
  using (status = 'published' or private.is_space_owner(id) or private.is_staff());

create policy spaces_write on spaces for all
  using (private.is_space_owner(id) or private.is_staff())
  with check (private.is_space_owner(id) or private.is_staff());

-- Everything hanging off a space follows that space: readable when the
-- listing is published, writable by whoever maintains it.
do $$
declare t text;
begin
  foreach t in array array[
    'space_services', 'space_images', 'space_hours',
    'space_busy_windows', 'space_closures', 'space_status_overrides', 'offers'
  ] loop
    execute format($f$
      create policy %1$s_read on %1$I for select
        using (exists (
          select 1 from spaces s
           where s.id = %1$I.space_id
             and (s.status = 'published' or private.is_space_owner(s.id) or private.is_staff())
        ))
    $f$, t);
    execute format($f$
      create policy %1$s_write on %1$I for all
        using (private.is_space_owner(space_id) or private.is_staff())
        with check (private.is_space_owner(space_id) or private.is_staff())
    $f$, t);
  end loop;
end $$;

create policy space_owners_read on space_owners for select
  using (user_id = auth.uid() or private.is_staff());
create policy space_owners_write on space_owners for all
  using (private.is_staff()) with check (private.is_staff());

-- ── a person's own data ────────────────────────────────────────────────

-- The display name and avatar on a review are public by design; that is the
-- whole reason this table holds nothing else.
create policy profiles_read        on profiles for select using (true);
create policy profiles_insert_self on profiles for insert with check (id = auth.uid());
create policy profiles_update_self on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- Contact details and preferences: the owner, and nobody else. Not staff
-- either — support can read the message someone sent, not their profile.
create policy profile_private_own on profile_private for all
  using (id = auth.uid()) with check (id = auth.uid());

create policy favorites_own on favorites for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy space_views_own on space_views for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy visits_own on visits for all
  using (user_id = auth.uid() or private.is_staff())
  with check (user_id = auth.uid());

-- ── reviews are public once published ──────────────────────────────────

create policy reviews_read on reviews for select
  using (status = 'published' or user_id = auth.uid() or private.is_staff());

create policy reviews_insert_own on reviews for insert
  with check (user_id = auth.uid());

create policy reviews_update_own on reviews for update
  using (user_id = auth.uid() or private.is_staff())
  with check (user_id = auth.uid() or private.is_staff());

create policy reviews_delete_own on reviews for delete
  using (user_id = auth.uid() or private.is_staff());

-- ── the inbox ──────────────────────────────────────────────────────────

-- Anyone may write to us; nobody but staff may read what others wrote.
create policy contact_messages_insert on contact_messages for insert with check (true);
create policy contact_messages_read   on contact_messages for select using (private.is_staff());
create policy contact_messages_write  on contact_messages for update
  using (private.is_staff()) with check (private.is_staff());

create policy space_suggestions_insert on space_suggestions for insert with check (true);
create policy space_suggestions_read   on space_suggestions for select
  using (suggested_by = auth.uid() or private.is_staff());

-- Staff membership is granted out of band, with the service role. A person
-- may see that they are staff; they may not make themselves staff.
create policy staff_read_self on staff for select using (user_id = auth.uid());

-- ── grants ─────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on
  profiles, profile_private, favorites, space_views, visits, reviews,
  contact_messages, space_suggestions
  to authenticated;
grant insert on contact_messages, space_suggestions to anon;
grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;
