-- Auto-create a customers profile row whenever a new Supabase Auth user is
-- created, instead of relying on client/server-action code to remember to
-- insert one (which would silently drift for OAuth/magic-link signups that
-- don't go through lib/actions/auth.ts).
create or replace function handle_new_auth_user()
returns trigger as $$
begin
  insert into public.customers (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_handle_new_auth_user
  after insert on auth.users
  for each row execute function handle_new_auth_user();
