import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadProjectImage } from '../../utils/storage';
import { addProject } from '../../firebase/firestore';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTech, setProjectTech] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadProjectImage(imageFile);
            }

            // Save to Firestore
            await addProject({
                title: projectTitle,
                description: projectDescription,
                technologies: projectTech.split(',').map(tech => tech.trim()),
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });

            // Clear form
            setProjectTitle('');
            setProjectDescription('');
            setProjectTech('');
            setImageFile(null);
            setImagePreview('');

            // Show success message
            alert('Project added successfully!');

        } catch (error) {
            setError('Failed to add project: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="mb-4">Welcome, {user.email}</p>
                    
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                <input
                                    type="text"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Technologies (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={projectTech}
                                    onChange={(e) => setProjectTech(e.target.value)}
                                    placeholder="React, Node.js, Firebase"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Project Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full"
                                    required
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-auto object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {loading ? 'Adding Project...' : 'Add Project'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 