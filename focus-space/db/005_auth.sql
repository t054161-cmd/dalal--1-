-- ═══════════════════════════════════════════════════════════════════════
--  FOCUS SPACE — registration
--
--  Supabase Auth owns the credentials. These triggers give every new
--  account the two rows the product needs, so the application never has to
--  create them at exactly the right moment — and an account can never end
--  up without a profile because a browser closed mid-signup.
-- ═══════════════════════════════════════════════════════════════════════

set search_path = public, extensions;

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do nothing;

  insert into public.profile_private (id, email, phone, language)
  values (
    new.id,
    new.email,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    case when new.raw_user_meta_data ->> 'language' = 'ar' then 'ar' else 'en' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- Changing the address you sign in with should change the address we hold.
create or replace function handle_user_email_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.profile_private set email = new.email, updated_at = now()
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_change on auth.users;
create trigger on_auth_user_email_change
after update of email on auth.users
for each row when (new.email is distinct from old.email)
execute function handle_user_email_change();
