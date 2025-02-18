import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databaseServices } from '../services/supabaseServices';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('all');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await databaseServices.getCollection('projects');
                setProjects(data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = selectedType === 'all'
        ? projects
        : projects.filter(project => project.name === selectedType);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Projects</h2>
                <div className="text-center text-gray-600">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Projects</h2>
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Projects</h2>
                <p className="text-center text-gray-600">No projects found.</p>
            </div>
        );
    }

    // Get unique project types
    const projectTypes = ['all', ...new Set(projects.map(project => project.name))];

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Projects</h2>
            
            <div className="mb-8 flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            selectedType === type
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {project.image_url && (
                            <div className="w-full h-48 bg-gray-100">
                                <img
                                    src={project.image_url}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <div className="flex gap-4">
                                {project.github_link && (
                                    <a
                                        href={project.github_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {project.live_link && (
                                    <a
                                        href={project.live_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}