import { useState, useEffect } from 'react';
import { databaseServices } from '../services/supabaseServices';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ManageHero() {
    const [heroContent, setHeroContent] = useState({
        title: '',
        subtitle: '',
        videoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchHeroContent();
    }, []);

    const fetchHeroContent = async () => {
        try {
            setLoading(true);
            const { data, error } = await databaseServices.getCollection('hero_content');
            if (error) {
                console.error('Error in fetchHeroContent:', error);
                throw error;
            }
            if (data && data.length > 0) {
                setHeroContent(data[0]);
            }
        } catch (error) {
            console.error('Error fetching hero content:', error);
            setError('Failed to load hero content. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            let result;
            if (heroContent.id) {
                result = await databaseServices.update('hero_content', heroContent.id, heroContent);
            } else {
                result = await databaseServices.create('hero_content', {
                    ...heroContent,
                    created_at: new Date().toISOString()
                });
            }
            if (result.error) throw result.error;
            
            setSuccess('Hero content saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
            
            // Refresh the content after saving
            await fetchHeroContent();
        } catch (error) {
            console.error('Error saving hero content:', error);
            setError('Failed to save hero content: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-6">Manage Hero Section</h2>
                <div className="text-center text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Manage Hero Section</h2>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <ReactQuill 
                        value={heroContent.title || ''}
                        onChange={(value) => setHeroContent(prev => ({ ...prev, title: value }))}
                        modules={modules}
                        className="bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                    </label>
                    <ReactQuill 
                        value={heroContent.subtitle || ''}
                        onChange={(value) => setHeroContent(prev => ({ ...prev, subtitle: value }))}
                        modules={modules}
                        className="bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL (YouTube/Vimeo embed URL)
                    </label>
                    <input
                        type="url"
                        value={heroContent.videoUrl || ''}
                        onChange={(e) => setHeroContent(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="e.g., https://www.youtube.com/embed/YOUR_VIDEO_ID"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Use the embed URL from YouTube or Vimeo. For YouTube, click Share > Embed and copy the URL from the iframe src attribute.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}