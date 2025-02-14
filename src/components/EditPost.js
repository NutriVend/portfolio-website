import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';
import { useAuth } from '../context/AuthContext';

export default function EditPost() {
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [currentCoverImage, setCurrentCoverImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await databaseServices.getCollection(`blog_posts/${postId}`);
                if (error) throw error;
                if (data) {
                    setTitle(data.title);
                    setContent(data.content);
                    setExcerpt(data.excerpt);
                    setCurrentCoverImage(data.cover_image);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to load blog post');
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

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
                throw new Error('You must be logged in to edit a post');
            }

            let coverImageUrl = currentCoverImage;
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
                read_time: readTime
            };

            const result = await databaseServices.update('blog_posts', postId, postData);
            console.log('Post updated successfully:', result);

            navigate(`/blog/${postId}`);
        } catch (error) {
            console.error('Error updating post:', error);
            setError(error.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
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
                    {currentCoverImage && (
                        <div className="mb-2">
                            <img 
                                src={currentCoverImage} 
                                alt="Current cover" 
                                className="h-32 object-cover rounded"
                            />
                        </div>
                    )}
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
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}