import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { databaseServices } from '../services/supabaseServices';

export default function BlogPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await databaseServices.getCollection(`blog_posts/${postId}`);
                if (error) throw error;
                if (data) {
                    setPost(data);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-xl text-gray-600">Loading article...</div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Article not found</div>;
    }

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                    {post.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium">
                            {post.author_name?.[0] || 'A'}
                        </span>
                    </div>
                    <div>
                        <div className="font-medium">{post.author_name || 'Anonymous'}</div>
                        <div className="text-sm text-gray-500">
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                            <span className="mx-2">·</span>
                            <span>{post.read_time || '5'} min read</span>
                        </div>
                    </div>
                </div>

                {post.cover_image && (
                    <div className="aspect-w-16 aspect-h-9 mb-8 overflow-hidden rounded-lg">
                        <img 
                            src={post.cover_image} 
                            alt={post.title}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>
                )}
            </header>

            <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-medium">
                                {post.author_name?.[0] || 'A'}
                            </span>
                        </div>
                        <div>
                            <div className="font-medium text-lg">Written by</div>
                            <div className="text-xl font-serif">{post.author_name || 'Anonymous'}</div>
                        </div>
                    </div>
                </div>
            </footer>
        </article>
    );
}