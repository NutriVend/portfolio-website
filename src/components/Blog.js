import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'blog-posts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading posts...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
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
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">·</span>
                            <span>{post.readTime} min read</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}