import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';
import { useAuth } from '../context/AuthContext';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const calculateReadTime = (text) => {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                throw new Error('You must be logged in to create a post');
            }

            let coverImageUrl = '';
            if (coverImage) {
                try {
                    coverImageUrl = await databaseServices.uploadFile(coverImage, 'blog-covers');
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw new Error(`Failed to upload cover image: ${uploadError.message}`);
                }
            }

            const readTime = calculateReadTime(content);

            const postData = {
                title,
                content,
                excerpt,
                cover_image: coverImageUrl,
                read_time: readTime,
                author_id: user.id,
                created_at: new Date().toISOString()
            };

            console.log('Creating post with data:', postData);

            const result = await databaseServices.create('blog_posts', postData);
            console.log('Post created successfully:', result);

            navigate('/blog');
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="A brief summary of your post"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Markdown supported)
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
                        placeholder="Write your post content here (Markdown supported)"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}