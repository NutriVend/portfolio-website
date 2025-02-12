import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
    const { user, logoutUser } = useAuth();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            <a href="https://app.nutrivend.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center py-4">
                                <span className="font-semibold text-gray-800 text-lg">NutriVend</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/#about" className="py-4 px-2 text-gray-700 hover:text-gray-900">About</Link>
                        <Link to="/#projects" className="py-4 px-2 text-gray-700 hover:text-gray-900">Projects</Link>
                        <Link to="/#contact" className="py-4 px-2 text-gray-700 hover:text-gray-900">Contact</Link>
                        {user ? (
                            <>
                                <Link to="/admin" className="py-4 px-2 text-gray-700 hover:text-gray-900">Admin</Link>
                                <button 
                                    onClick={logoutUser}
                                    className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 