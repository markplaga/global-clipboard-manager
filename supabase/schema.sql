-- Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Categories
create table public.categories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    color text default 'zinc',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Users can view their own categories" on categories
    for select using (auth.uid() = user_id);

create policy "Users can insert their own categories" on categories
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own categories" on categories
    for update using (auth.uid() = user_id);

create policy "Users can delete their own categories" on categories
    for delete using (auth.uid() = user_id);

-- Snippets
create table public.snippets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    category_id uuid references public.categories on delete set null,
    content text not null,
    is_favorite boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.snippets enable row level security;

create policy "Users can view their own snippets" on snippets
    for select using (auth.uid() = user_id);

create policy "Users can insert their own snippets" on snippets
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own snippets" on snippets
    for update using (auth.uid() = user_id);

create policy "Users can delete their own snippets" on snippets
    for delete using (auth.uid() = user_id);

-- Trigger for updated_at
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_snippet_updated
  before update on snippets
  for each row execute procedure public.handle_updated_at();

-- Trigger for New User Profile
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
