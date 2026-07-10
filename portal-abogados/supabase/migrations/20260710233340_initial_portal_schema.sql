create type public.profile_role as enum ('person', 'lawyer', 'admin');
create type public.verification_status as enum ('draft', 'pending', 'verified', 'rejected');
create type public.case_status as enum ('open', 'matched', 'closed');
create type public.proposal_status as enum ('sent', 'accepted', 'declined');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.profile_role not null default 'person',
  phone text,
  region text,
  comuna text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lawyer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  public_name text not null default '',
  bio text,
  years_experience smallint check (years_experience between 0 and 70),
  attention_mode text[] not null default '{}',
  verification public.verification_status not null default 'draft',
  is_accepting_cases boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_areas (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  is_active boolean not null default true
);

create table public.lawyer_practice_areas (
  lawyer_id uuid not null references public.lawyer_profiles(user_id) on delete cascade,
  area_id bigint not null references public.practice_areas(id) on delete restrict,
  primary key (lawyer_id, area_id)
);

create table public.case_requests (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.profiles(id) on delete cascade,
  area_id bigint references public.practice_areas(id) on delete set null,
  title text not null check (char_length(title) between 8 and 140),
  description text not null check (char_length(description) between 30 and 5000),
  region text not null,
  comuna text,
  attention_mode text not null check (attention_mode in ('online', 'presencial', 'cualquiera')),
  status public.case_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_matches (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.case_requests(id) on delete cascade,
  lawyer_id uuid not null references public.lawyer_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(case_id, lawyer_id)
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.case_requests(id) on delete cascade,
  lawyer_id uuid not null references public.lawyer_profiles(user_id) on delete cascade,
  message text not null check (char_length(message) between 20 and 3000),
  price_note text,
  status public.proposal_status not null default 'sent',
  created_at timestamptz not null default now(),
  unique(case_id, lawyer_id)
);

create index case_requests_person_id_idx on public.case_requests(person_id);
create index case_requests_area_status_idx on public.case_requests(area_id, status);
create index case_matches_lawyer_id_idx on public.case_matches(lawyer_id);
create index proposals_lawyer_id_idx on public.proposals(lawyer_id);

create schema if not exists private;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.profile_role;
begin
  requested_role := case new.raw_user_meta_data ->> 'intended_role'
    when 'lawyer' then 'lawyer'::public.profile_role
    else 'person'::public.profile_role
  end;

  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role);

  if requested_role = 'lawyer' then
    insert into public.lawyer_profiles (user_id, public_name, verification)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'pending');
  end if;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create function private.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator may change a user role';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.protect_profile_role() from public;

create trigger protect_profile_role_before_update
  before update on public.profiles
  for each row execute function private.protect_profile_role();

alter table public.profiles enable row level security;
alter table public.lawyer_profiles enable row level security;
alter table public.practice_areas enable row level security;
alter table public.lawyer_practice_areas enable row level security;
alter table public.case_requests enable row level security;
alter table public.case_matches enable row level security;
alter table public.proposals enable row level security;

grant select, update on public.profiles to authenticated;
grant select, update on public.lawyer_profiles to authenticated;
grant select on public.practice_areas to authenticated;
grant select, insert, delete on public.lawyer_practice_areas to authenticated;
grant select, insert, update on public.case_requests to authenticated;
grant select, insert on public.case_matches to authenticated;
grant select, insert, update on public.proposals to authenticated;

create policy "Profiles: own or admin read" on public.profiles for select to authenticated using ((select auth.uid()) = id or (select public.is_admin()));
create policy "Profiles: own or admin update" on public.profiles for update to authenticated using ((select auth.uid()) = id or (select public.is_admin())) with check ((select auth.uid()) = id or (select public.is_admin()));

create policy "Lawyer profiles: verified directory or owner" on public.lawyer_profiles for select to authenticated using (verification = 'verified' or (select auth.uid()) = user_id or (select public.is_admin()));
create policy "Lawyer profiles: owner or admin update" on public.lawyer_profiles for update to authenticated using ((select auth.uid()) = user_id or (select public.is_admin())) with check ((select auth.uid()) = user_id or (select public.is_admin()));

create policy "Practice areas: authenticated read" on public.practice_areas for select to authenticated using (true);
create policy "Lawyer areas: verified directory or owner" on public.lawyer_practice_areas for select to authenticated using ((select auth.uid()) = lawyer_id or (select public.is_admin()) or exists (select 1 from public.lawyer_profiles lp where lp.user_id = lawyer_id and lp.verification = 'verified'));
create policy "Lawyer areas: owner or admin insert" on public.lawyer_practice_areas for insert to authenticated with check ((select auth.uid()) = lawyer_id or (select public.is_admin()));
create policy "Lawyer areas: owner or admin delete" on public.lawyer_practice_areas for delete to authenticated using ((select auth.uid()) = lawyer_id or (select public.is_admin()));

create policy "Cases: owner or admin read" on public.case_requests for select to authenticated using ((select auth.uid()) = person_id or (select public.is_admin()));
create policy "Cases: person creates own" on public.case_requests for insert to authenticated with check ((select auth.uid()) = person_id and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'person'));
create policy "Cases: owner or admin update" on public.case_requests for update to authenticated using ((select auth.uid()) = person_id or (select public.is_admin())) with check ((select auth.uid()) = person_id or (select public.is_admin()));

create policy "Matches: participants or admin read" on public.case_matches for select to authenticated using ((select auth.uid()) = lawyer_id or (select public.is_admin()) or exists (select 1 from public.case_requests cr where cr.id = case_id and cr.person_id = (select auth.uid())));
create policy "Matches: verified lawyer or admin creates" on public.case_matches for insert to authenticated with check (((select auth.uid()) = lawyer_id and exists (select 1 from public.lawyer_profiles lp where lp.user_id = (select auth.uid()) and lp.verification = 'verified')) or (select public.is_admin()));

create policy "Proposals: participants or admin read" on public.proposals for select to authenticated using ((select auth.uid()) = lawyer_id or (select public.is_admin()) or exists (select 1 from public.case_requests cr where cr.id = case_id and cr.person_id = (select auth.uid())));
create policy "Proposals: verified lawyer or admin creates" on public.proposals for insert to authenticated with check (((select auth.uid()) = lawyer_id and exists (select 1 from public.lawyer_profiles lp where lp.user_id = (select auth.uid()) and lp.verification = 'verified')) or (select public.is_admin()));
create policy "Proposals: participants or admin update" on public.proposals for update to authenticated using ((select auth.uid()) = lawyer_id or (select public.is_admin()) or exists (select 1 from public.case_requests cr where cr.id = case_id and cr.person_id = (select auth.uid()))) with check ((select auth.uid()) = lawyer_id or (select public.is_admin()) or exists (select 1 from public.case_requests cr where cr.id = case_id and cr.person_id = (select auth.uid())));

insert into public.practice_areas (name, slug) values
  ('Derecho de Familia', 'familia'),
  ('Derecho Civil', 'civil'),
  ('Derecho Laboral', 'laboral'),
  ('Derecho Penal', 'penal'),
  ('Derecho Comercial', 'comercial'),
  ('Derecho Tributario', 'tributario')
on conflict (slug) do nothing;
