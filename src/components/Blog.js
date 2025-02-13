import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await databaseServices.getCollection('blog-posts');
                if (error) throw error;
                setPosts(data || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load blog posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading posts...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
            {posts.length === 0 ? (
                <p className="text-center text-gray-600">No blog posts yet.</p>
            ) : (
                <div className="space-y-8">
                    {posts.map(post => (
                        <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold mb-2">
                                <Link to={`/blog/${post.id}`} className="hover:text-blue-600">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                <span className="mx-2">·</span>
                                <span>{post.read_time || '5'} min read</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}