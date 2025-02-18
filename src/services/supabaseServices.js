import { supabase, storage } from '../config/supabase';

export const authServices = {
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const { data, error } = await supabase
      .rpc('validate_and_update_project', {
        p_data: projectData,
        p_id: projectId
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating project:', error);
    return { data: null, error: error.message };
  }
};

export const databaseServices = {
  initializeTables: async () => {
    try {
      // Check if the projects table exists
      const { error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (projectsError && projectsError.code === '42P01') {
        console.log('Creating projects table...');
        await supabase.rpc('create_projects_table', {
          sql: `
            CREATE TABLE IF NOT EXISTS projects (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              description TEXT,
              image_url TEXT,
              github_link TEXT,
              live_link TEXT,
              start_date DATE,
              end_date DATE,
              display_order INTEGER,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
            );
          `
        });

        // Create a default project
        const { error } = await supabase
          .from('projects')
          .insert([{ 
            name: 'DIY',
            display_order: 0,
            created_at: new Date().toISOString()
          }]);

        if (error && !error.message.includes('already exists')) {
          throw error;
        }
      }

      console.log('Database initialization completed');
    } catch (error) {
      console.error('Error in initializeTables:', error);
      throw error;
    }
  },

  // Create
  create: async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([{
          ...data,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return result[0];
    } catch (error) {
      throw new Error(`Failed to create record in ${table}: ${error.message}`);
    }
  },

  // Get collection
  getCollection: async (path) => {
    try {
      const [table, id] = path.split('/');
      console.log('Querying table:', table);
      
      if (id) {
        const response = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();
        console.log(`Single ${table} response:`, response);
        if (response.error) throw response.error;
        return { data: response.data };
      } else {
        let query = supabase
          .from(table)
          .select('*');
        
        // Add specific ordering for projects
        if (table === 'projects') {
          query = query.order('display_order', { ascending: true, nullsLast: true });
        } else if (table === 'hero_content') {
          // Only fetch the first hero content record
          query = query.limit(1);
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const response = await query;
        console.log(`${table} collection response:`, response);
        
        if (response.error) {
          console.error(`Error fetching ${table}:`, response.error);
          throw response.error;
        }
        
        if (!response.data) {
          console.warn(`No data returned for ${table}`);
        }
        
        return { data: response.data || [] };
      }
    } catch (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch from ${path}: ${error.message}`);
    }
  },

  // Projects specific operations
  getProject: async (id) => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return project;
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error.message}`);
    }
  },

  createProject: async (projectData) => {
    try {
      let imageUrl = '';
      if (projectData.image) {
        imageUrl = await databaseServices.uploadFile(projectData.image, 'project-images');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name,
          description: projectData.description,
          image_url: imageUrl,
          github_link: projectData.github_link,
          live_link: projectData.live_link,
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          display_order: projectData.display_order,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Update project error:', error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  },

  // File upload
  uploadFile: async (file, bucketName = 'project-images') => {
    if (!file) {
      throw new Error('No file provided');
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { data, error: uploadError } = await storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
            
      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      if (error.message.includes('bucket') || error.message.includes('404')) {
        throw new Error(`The storage bucket "${bucketName}" does not exist. Please create it in your Supabase dashboard.`);
      }
      throw error;
    }
  }
};