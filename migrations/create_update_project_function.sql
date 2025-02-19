-- Create the update_project function
CREATE OR REPLACE FUNCTION update_project(
    p_id INTEGER,
    p_title TEXT,
    p_description TEXT,
    p_category_id INTEGER,
    p_image_url TEXT,
    p_github_link TEXT,
    p_live_link TEXT,
    p_start_date DATE,
    p_end_date DATE,
    p_updated_at TIMESTAMP WITH TIME ZONE
)
RETURNS SETOF projects AS $$
BEGIN
    RETURN QUERY
    UPDATE projects
    SET 
        title = COALESCE(p_title, title),
        description = COALESCE(p_description, description),
        category_id = COALESCE(p_category_id, category_id),
        image_url = COALESCE(p_image_url, image_url),
        github_link = COALESCE(p_github_link, github_link),
        live_link = COALESCE(p_live_link, live_link),
        start_date = COALESCE(p_start_date, start_date),
        end_date = COALESCE(p_end_date, end_date),
        updated_at = p_updated_at
    WHERE id = p_id
    RETURNING *;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;