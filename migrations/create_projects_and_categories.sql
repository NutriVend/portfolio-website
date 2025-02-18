-- Create categories table if it doesn't exist
create table if not exists categories (
    id serial primary key,
    name text not null,
    image_url text,
    display_order integer,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

-- Create projects table if it doesn't exist
create table if not exists projects (
    id serial primary key,
    title text not null,
    description text,
    category_id integer references categories(id) on delete set null,
    image_url text,
    github_link text,
    live_link text,
    start_date date,
    end_date date,
    user_id uuid,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table categories enable row level security;
alter table projects enable row level security;

-- Set up policies for categories (only if they don't exist)
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'Enable read access for all users') then
        create policy "Enable read access for all users" on categories for select using (true);
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'Enable insert for authenticated users only') then
        create policy "Enable insert for authenticated users only" on categories for insert with check (auth.role() = 'authenticated');
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'Enable update for authenticated users only') then
        create policy "Enable update for authenticated users only" on categories for update using (auth.role() = 'authenticated');
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'Enable delete for authenticated users only') then
        create policy "Enable delete for authenticated users only" on categories for delete using (auth.role() = 'authenticated');
    end if;
end $$;

-- Set up policies for projects (only if they don't exist)
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Enable read access for all users') then
        create policy "Enable read access for all users" on projects for select using (true);
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Enable insert for authenticated users only') then
        create policy "Enable insert for authenticated users only" on projects for insert with check (auth.role() = 'authenticated');
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Enable update for authenticated users only') then
        create policy "Enable update for authenticated users only" on projects for update using (auth.role() = 'authenticated');
    end if;
    
    if not exists (select 1 from pg_policies where tablename = 'projects' and policyname = 'Enable delete for authenticated users only') then
        create policy "Enable delete for authenticated users only" on projects for delete using (auth.role() = 'authenticated');
    end if;
end $$;