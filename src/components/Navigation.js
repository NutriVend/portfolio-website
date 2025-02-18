import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { databaseServices } from '../services/supabaseServices';

export default function Navigation() {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const initAndFetchProjects = async () => {
            try {
                await databaseServices.initializeTables();
                const { data } = await databaseServices.getCollection('projects');
                const sortedData = data ? [...data].sort((a, b) => 
                    (a.display_order ?? Infinity) - (b.display_order ?? Infinity)
                ) : [];
                setProjects(sortedData);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError(error.message);
            }
        };

        initAndFetchProjects();
    }, []);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            <Link to="/" className="flex items-center py-4">
                                <span className="font-semibold text-gray-500 text-lg">Portfolio</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">Home</Link>
                            <Link to="/about" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">About</Link>
                            <Link to="/projects" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">Projects</Link>
                            <Link to="/contact" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">Contact</Link>
                            {user && (
                                <Link to="/admin/dashboard" className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300">Admin</Link>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <button
                                onClick={logout}
                                className="py-2 px-4 text-gray-500 hover:text-blue-500 transition duration-300"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="py-2 px-4 text-gray-500 hover:text-blue-500 transition duration-300">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}