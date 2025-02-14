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
                console.log('Fetching posts...');
                const response = await databaseServices.getCollection('blog_posts');
                console.log('Fetched posts response:', response);
                if (response.data) {
                    setPosts(response.data);
                } else {
                    console.error('No data received from getCollection');
                    setError('Failed to load blog posts');
                }
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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-xl text-gray-600">Loading stories...</div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-serif font-bold mb-12 text-center">Latest Stories</h1>
            
            {posts.length === 0 ? (
                <div className="text-center text-gray-600 py-12">
                    <p className="text-xl">No stories published yet.</p>
                    <p className="mt-2">Check back soon for amazing content.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-102">
                            {post.cover_image && (
                                <Link to={`/blog/${post.id}`}>
                                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                        <img 
                                            src={post.cover_image} 
                                            alt={post.title}
                                            className="w-full h-48 object-contain bg-gray-50"
                                        />
                                    </div>
                                </Link>
                            )}
                            
                            <div className="p-6">
                                <Link to={`/blog/${post.id}`}>
                                    <h2 className="text-2xl font-sans font-bold mb-3 hover:text-gray-700 transition-colors">
                                        {post.title}
                                    </h2>
                                </Link>
                                
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {post.author_name?.[0] || 'A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                            <span className="mx-2">·</span>
                                            <span>{post.read_time || '5'} min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}