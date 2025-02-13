import { Link } from 'react-router-dom';

const AdminNav = () => {
    return (
        <nav className="bg-gray-100 shadow-md mb-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center space-x-4 py-3">
                    <Link 
                        to="/admin"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/admin/add-project"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Add Project
                    </Link>
                    <Link 
                        to="/admin/create-post"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Create Post
                    </Link>
                    <Link 
                        to="/admin/categories"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                        Manage Categories
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;