import { useState } from 'react';
import AdminNav from './AdminNav';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';
import { checkCategoriesCollection } from '../firebase/firestore';

export default function AdminDashboard() {
    const user = auth.currentUser;

    return (
        <div>
            {/* Admin Navigation */}
            <nav className="bg-gray-100 shadow-md mb-6">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center space-x-4 py-3">
                        <a 
                            href="/admin"
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Dashboard
                        </a>
                        <a 
                            href="/admin/categories"
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            Manage Categories
                        </a>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <p className="mb-4">Welcome, {user?.email}</p>

                {/* Admin Actions */}
                <div className="flex gap-4 mb-8">
                    <Link 
                        to="/admin/categories"
                        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Manage Categories
                    </Link>
                </div>

                {/* Add New Project Form */}
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                    <div className="grid gap-4">
                        <Link 
                            to="/admin/add-project" 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add New Project
                        </Link>
                        <button 
                            onClick={async () => {
                                const exists = await checkCategoriesCollection();
                                console.log('Categories collection exists:', exists);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Check Categories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 