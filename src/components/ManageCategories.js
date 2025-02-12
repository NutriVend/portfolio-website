import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categoriesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoriesData);
            } catch (error) {
                setError('Failed to fetch categories');
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Add new category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const docRef = await addDoc(collection(db, 'categories'), {
                name: newCategory.trim(),
                createdAt: serverTimestamp()
            });
            
            setCategories([...categories, { 
                id: docRef.id, 
                name: newCategory.trim() 
            }]);
            setNewCategory('');
            setSuccess('Category added successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to add category');
            console.error('Error adding category:', error);
        }
    };

    // Delete category
    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteDoc(doc(db, 'categories', categoryId));
                setCategories(categories.filter(cat => cat.id !== categoryId));
                setSuccess('Category deleted successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete category');
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
            
            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Category
                    </button>
                </div>
            </form>

            {/* Success/Error Messages */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            {/* Categories List */}
            <div className="space-y-2">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                        <span>{category.name}</span>
                        <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 