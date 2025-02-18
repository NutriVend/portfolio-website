import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const initAndFetchProjects = async () => {
            try {
                setLoading(true);
                // Initialize tables before fetching
                await databaseServices.initializeTables();
                const projectsData = await databaseServices.getProjects();
                console.log('Fetched projects:', projectsData);
                setProjects(projectsData || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError('Failed to load projects: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        initAndFetchProjects();
    }, []);

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }
        
        try {
            setError(''); // Clear any previous errors
            const deleted = await databaseServices.delete('projects', projectId);
            
            if (!deleted) {
                throw new Error('Failed to delete project from database');
            }
            
            setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            setError(`Failed to delete project: ${error.message}`);
        }
    };

    const handleUpdateProject = async (projectId, projectData) => {
        try {
            setError('');
            const { data, error } = await databaseServices.rpc('validate_and_update_project', {
                p_data: {
                    category_id: projectData.category_id,
                    project_name: projectData.title,
                    description: projectData.description,
                    start_date: projectData.start_date,
                    end_date: projectData.end_date,
                    project_image: projectData.image_url
                },
                p_id: projectId
            });

            if (error) throw new Error(error.message);
            if (!data.success) throw new Error(data.error);

            // Update local state with the updated project
            setProjects(prevProjects => 
                prevProjects.map(project => 
                    project.id === projectId ? data.data : project
                )
            );

            return data.data;
        } catch (error) {
            console.error('Error updating project:', error);
            setError(`Failed to update project: ${error.message}`);
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="mb-4">Welcome, {user?.email}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <Link 
                            to="/admin/add-project"
                            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-center"
                        >
                            Add New Project
                        </Link>
                        <Link 
                            to="/admin/create-post"
                            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-center"
                        >
                            Create Blog Post
                        </Link>
                        <Link 
                            to="/admin/categories"
                            className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 text-center"
                        >
                            Manage Categories
                        </Link>
                        <Link 
                            to="/admin/hero"
                            className="bg-indigo-500 text-white p-4 rounded-lg hover:bg-indigo-600 text-center"
                        >
                            Manage Hero Section
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">Manage Projects</h2>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {loading ? (
                            <p className="text-gray-600">Loading projects...</p>
                        ) : (
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <div 
                                        key={project.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-semibold">{project.title}</h3>
                                            <p className="text-sm text-gray-600">{project.category?.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/edit-project/${project.id}`}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}