import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase config check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length,
    keyLength: supabaseAnonKey?.length
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing required Supabase configuration. Please check your environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'X-Client-Info': 'portfolio-website'
        }
    }
});

// Disable schema caching
supabase.disableSchemaCache?.();

export const storage = supabase.storage;
export const auth = supabase.auth;

// Test connection
supabase.from('projects').select('count', { head: true })
    .then(({ error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error);
        } else {
            console.log('Supabase connection test successful');
        }
    })
    .catch(error => {
        console.error('Supabase connection test error:', error);
    });

export default supabase;