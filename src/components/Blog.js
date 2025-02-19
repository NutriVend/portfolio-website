import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';

export default function Blog() {
    const { categoryId } = useParams();
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let response;
                
                if (categoryId) {
                    const [postsResponse, categoryResponse] = await Promise.all([
                        databaseServices.getCollection('blog_posts'),
                        databaseServices.getCollection(`categories/${categoryId}`)
                    ]);
                    
                    if (!categoryResponse.data) {
                        setError('Category not found');
                        return;
                    }

                    setCategory(categoryResponse.data);
                    
                    // More explicit data validation
                    if (!postsResponse.data || !Array.isArray(postsResponse.data)) {
                        setError('Failed to load blog posts');
                        return;
                    }

                    const filteredPosts = postsResponse.data.filter(post => post.category_id === categoryId);
                    setPosts(filteredPosts);
                } else {
                    // Fetch all posts if no category is specified
                    response = await databaseServices.getCollection('blog_posts');
                    if (!response.data || !Array.isArray(response.data)) {
                        setError('Failed to load blog posts');
                        return;
                    }
                    setPosts(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load content');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [categoryId]);

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
            <h1 className="text-4xl font-serif font-bold mb-12 text-center">
                {category ? `Posts in ${category.name}` : 'Latest Stories'}
            </h1>
            
            {posts.length === 0 ? (
                <div className="text-center text-gray-600 py-12">
                    <p className="text-xl">No stories published {category ? 'in this category' : 'yet'}.</p>
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