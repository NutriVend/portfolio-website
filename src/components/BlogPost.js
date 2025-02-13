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
                const { data, error } = await databaseServices.getCollection(`blog-posts/${postId}`);
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
        return <div className="text-center py-8">Loading post...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Post not found</div>;
    }

    return (
        <article className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="mx-2">·</span>
                <span>{post.read_time || '5'} min read</span>
            </div>
            {post.cover_image && (
                <img 
                    src={post.cover_image} 
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                />
            )}
            <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
        </article>
    );
}