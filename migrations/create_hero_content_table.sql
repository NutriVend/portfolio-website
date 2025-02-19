-- Create hero_content table
create table if not exists hero_content (
    id serial primary key,
    title text not null,
    subtitle text,
    created_at timestamp with time zone default timezone('utc', now()),
    updated_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table hero_content enable row level security;

-- Enable read access for all users
create policy "Enable read access for all users" on hero_content for select using (true);

-- Enable write access only for authenticated users
create policy "Enable insert for authenticated users only" on hero_content 
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on hero_content 
    for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on hero_content 
    for delete using (auth.role() = 'authenticated');