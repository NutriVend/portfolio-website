-- Create function to force schema refresh and validate project updates
CREATE OR REPLACE FUNCTION validate_and_update_project(
    p_id INTEGER,
    p_data JSONB
) RETURNS projects AS $$
DECLARE
    result projects;
BEGIN
    -- Force refresh of schema metadata
    NOTIFY pgrst, 'reload schema';
    
    -- Validate the category exists if category_id is provided
    IF (p_data->>'category_id') IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM categories 
            WHERE id = (p_data->>'category_id')::INTEGER
        ) THEN
            RAISE EXCEPTION 'Category with ID % not found', (p_data->>'category_id');
        END IF;
    END IF;

    -- Perform the update
    UPDATE projects
    SET 
        title = COALESCE((p_data->>'title'), title),
        description = COALESCE((p_data->>'description'), description),
        category_id = COALESCE((p_data->>'category_id')::INTEGER, category_id),
        image_url = COALESCE((p_data->>'image_url'), image_url),
        github_link = COALESCE((p_data->>'github_link'), github_link),
        live_link = COALESCE((p_data->>'live_link'), live_link),
        start_date = COALESCE((p_data->>'start_date')::DATE, start_date),
        end_date = COALESCE((p_data->>'end_date')::DATE, end_date),
        updated_at = COALESCE((p_data->>'updated_at')::TIMESTAMP WITH TIME ZONE, NOW())
    WHERE id = p_id
    RETURNING *
    INTO result;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project with ID % not found', p_id;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;