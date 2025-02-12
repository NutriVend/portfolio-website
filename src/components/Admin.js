import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';

export default function Admin() {
    const user = auth.currentUser;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="mb-6">Welcome, {user?.email}</p>

            {/* Admin Navigation Menu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link 
                    to="/admin/add-project" 
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center"
                >
                    Add Project
                </Link>
                <Link 
                    to="/admin/categories" 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 text-center"
                >
                    Manage Categories
                </Link>
            </div>

            {/* Add New Project Form */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                {/* Your existing form content */}
            </div>
        </div>
    );
} 