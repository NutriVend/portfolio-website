import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();

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
                    </div>
                </div>
            </div>
        </div>
    );
}