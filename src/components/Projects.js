import { useState, useEffect } from 'react';
import { databaseServices } from '../services/supabaseServices';

export default function Projects() {
    const [projects, setProjects] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await databaseServices.getProjects();
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setError('Failed to load projects');
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects?.filter(project => project.category === selectedCategory);

    if (error) {
        return (
            <div className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">My Projects</h2>
                    <div className="text-center text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">My Projects</h2>
                <p className="text-center text-gray-600">Projects are on their way!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">My Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
                        onClick={() => project.live_link && window.open(project.live_link, '_blank', 'noopener,noreferrer')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && project.live_link) {
                                window.open(project.live_link, '_blank', 'noopener,noreferrer');
                            }
                        }}
                    >
                        <img 
                            src={project.image_url || 'https://placehold.co/400x200'} 
                            alt={project.title}
                            className="w-full h-48 object-contain bg-gray-50"
                            onError={(e) => {
                                e.target.src = 'https://placehold.co/400x200';
                                e.target.alt = 'Project image placeholder';
                            }}
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies && typeof project.technologies === 'string' ? 
                                    project.technologies.split(',').map((tech, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                        >
                                            {tech.trim()}
                                        </span>
                                    ))
                                    : Array.isArray(project.technologies) ?
                                        project.technologies.map((tech, index) => (
                                            <span 
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                            >
                                                {tech.trim()}
                                            </span>
                                        ))
                                    : null
                                }
                            </div>
                            <div className="flex gap-4 z-10 relative" onClick={e => e.stopPropagation()}>
                                {project.live_link && (
                                    <a 
                                        href={project.live_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 inline-flex items-center"
                                    >
                                        View Live
                                    </a>
                                )}
                                {project.github_link && (
                                    <a 
                                        href={project.github_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 inline-flex items-center"
                                    >
                                        GitHub
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