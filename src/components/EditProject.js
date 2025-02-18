import React, { useState, useEffect } from 'react';
import { databaseServices } from '../services/supabaseServices';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditProject = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const project = await databaseServices.getProject(projectId);
                if (project) {
                    setName(project.name);
                    setDescription(project.description);
                    setCurrentImage(project.image_url);
                    setGithubLink(project.github_link || '');
                    setLiveLink(project.live_link || '');
                    setStartDate(project.start_date || '');
                    setEndDate(project.end_date || '');
                    setDisplayOrder(project.display_order || 0);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setError('Failed to load project');
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let projectImage = currentImage;
            if (image) {
                try {
                    projectImage = await databaseServices.uploadFile(image, 'project-images');
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    throw new Error('Failed to upload image: ' + uploadError.message);
                }
            }

            const projectData = {
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                image_url: projectImage,
                github_link: githubLink,
                live_link: liveLink,
                display_order: displayOrder
            };

            await databaseServices.updateProject(projectId, projectData);
            navigate('/admin/projects');
        } catch (err) {
            setError('Failed to update project. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Edit Project</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Project Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayOrder">
                        Display Order
                    </label>
                    <input
                        type="number"
                        id="displayOrder"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Project Image
                    </label>
                    {currentImage && (
                        <div className="mb-2">
                            <img 
                                src={currentImage} 
                                alt="Current project" 
                                className="h-32 object-contain"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="githubLink">
                        GitHub Link
                    </label>
                    <input
                        type="url"
                        id="githubLink"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://github.com/yourusername/project"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="liveLink">
                        Live Demo Link
                    </label>
                    <input
                        type="url"
                        id="liveLink"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://your-project-demo.com"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={loading}
                >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProject;