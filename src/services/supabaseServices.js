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

export const databaseServices = {
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
        console.log('Single item response:', response);
        if (response.error) throw response.error;
        return { data: response.data };
      } else {
        const response = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        console.log('Collection response:', response);
        if (response.error) throw response.error;
        return { data: response.data || [] };
      }
    } catch (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch from ${path}: ${error.message}`);
    }
  },

  // Projects specific operations
  createProject: async (projectData) => {
    try {
      console.log('Project data being sent:', projectData);
      let imageUrl = null;
      
      if (projectData.image) {
        const { data, error } = await storage
          .from('project-images')
          .upload(`${Date.now()}-${projectData.image.name}`, projectData.image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = storage
          .from('project-images')
          .getPublicUrl(data.path);
          
        imageUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          image_url: imageUrl,
          github_link: projectData.github_link,
          live_link: projectData.live_link,
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          user_id: projectData.user_id, // Add user_id to the insert
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  },

  getProjects: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
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
  uploadFile: async (file, bucket = 'blog-covers') => {
    if (!file) {
        throw new Error('No file provided');
    }
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the file
        const { data, error: uploadError } = await storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type // Explicitly set the content type
            });
            
        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
  },

  // Delete
  delete: async (table, id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to delete from ${table}: ${error.message}`);
    }
  }
};