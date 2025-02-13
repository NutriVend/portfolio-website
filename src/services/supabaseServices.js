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
      if (id) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      }
    } catch (error) {
      throw new Error(`Failed to fetch from ${path}: ${error.message}`);
    }
  },

  // Projects specific operations
  createProject: async (projectData) => {
    try {
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
          ...projectData,
          image_url: imageUrl,
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
  uploadFile: async (file, bucket = 'project-images') => {
    try {
      const { data, error } = await storage
        .from(bucket)
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
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