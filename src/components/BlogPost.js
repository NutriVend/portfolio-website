import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'blog-posts', postId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <div className="text-center py-8">Loading post...</div>;
    }

    if (!post) {
        return <div className="text-center py-8">Post not found</div>;
    }

    return (
        <article className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">·</span>
                <span>{post.readTime} min read</span>
            </div>
            {post.coverImage && (
                <img 
                    src={post.coverImage} 
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