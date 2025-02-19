-- Drop and recreate foreign key constraint to force schema refresh
DO $$
BEGIN
    -- Drop the existing foreign key if it exists
    ALTER TABLE IF EXISTS projects 
    DROP CONSTRAINT IF EXISTS projects_category_id_fkey;

    -- Recreate the foreign key constraint
    ALTER TABLE projects
    ADD CONSTRAINT projects_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL;
END $$;