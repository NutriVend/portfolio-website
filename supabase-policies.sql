-- Enable read access for all users (authenticated and public)
create policy "Enable read access for all users" on projects for select using (true);
create policy "Enable read access for all users" on categories for select using (true);
create policy "Enable read access for all users" on hero_content for select using (true);

-- Enable write access only for authenticated users
create policy "Enable insert for authenticated users only" on projects for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on projects for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on projects for delete using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users only" on categories for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on categories for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on categories for delete using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users only" on hero_content for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on hero_content for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on hero_content for delete using (auth.role() = 'authenticated');

-- Add policy to allow single row access for hero_content
create policy "Allow single row access for hero_content" on hero_content for select using (true);
create policy "Allow single row update for authenticated users" on hero_content for update using (auth.role() = 'authenticated');

-- Enable execution of SQL commands for authenticated users
create policy "Enable SQL execution for authenticated users" on postgres for execute using (auth.role() = 'authenticated');

-- Create execute_sql function for table management
create or replace function execute_sql(sql_query text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  execute sql_query;
end;
$$;

-- Create the create_table functions
create or replace function create_hero_content_table()
returns void
language plpgsql
security definer
as $$
begin
    create table if not exists hero_content (
        id serial primary key,
        title text not null,
        subtitle text,
        created_at timestamp with time zone default timezone('utc', now()),
        updated_at timestamp with time zone default timezone('utc', now())
    );
    alter table hero_content enable row level security;
end;
$$;

-- Grant execute permission on specific functions
grant execute on function execute_sql to authenticated;
grant execute on function rpc_call to authenticated;
grant execute on function execute_sql(text) to authenticated;
grant execute on function create_hero_content_table() to authenticated;