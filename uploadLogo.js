require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
    try {
        console.log('Checking environment variables...');
        console.log('Supabase URL length:', supabaseUrl?.length);
        console.log('Supabase Key length:', supabaseAnonKey?.length);

        const logoPath = path.resolve(__dirname, 'public/nutrivend-logo.png');
        console.log('Logo path:', logoPath);
        
        if (!fs.existsSync(logoPath)) {
            throw new Error('Logo file not found at: ' + logoPath);
        }

        const logoFile = fs.readFileSync(logoPath);
        console.log('Logo file read, size:', logoFile.length, 'bytes');

        const { data, error } = await supabase.storage
            .from('blog-covers')
            .upload('logos/nutrivend-logo.png', logoFile, {
                cacheControl: '3600',
                upsert: true,
                contentType: 'image/png'
            });

        if (error) throw error;
        console.log('Upload successful:', data);

        const { data: { publicUrl } } = supabase.storage
            .from('blog-covers')
            .getPublicUrl('logos/nutrivend-logo.png');

        console.log('Logo URL:', publicUrl);
    } catch (error) {
        console.error('Error uploading logo:', error.message);
        console.error('Error details:', error);
        process.exit(1);
    }
})();
