-- Begin transaction
BEGIN;

-- First, rename the categories table to projects (temporarily with a different name to avoid conflicts)
ALTER TABLE IF EXISTS categories RENAME TO projects_new;

-- Drop the existing projects table and its dependencies
DROP TABLE IF EXISTS projects CASCADE;

-- Rename the temporary table to its final name
ALTER TABLE projects_new RENAME TO projects;

-- Update the sequence name
ALTER SEQUENCE IF EXISTS categories_id_seq RENAME TO projects_id_seq;

-- Add any missing columns that were in the old projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS github_link TEXT,
ADD COLUMN IF NOT EXISTS live_link TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Move DIY project to appropriate category
UPDATE projects 
SET name = 'DIY'
WHERE name = 'categories';

-- Update policies
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON projects;

CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON projects FOR DELETE USING (auth.role() = 'authenticated');

COMMIT;