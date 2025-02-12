import React, { useState } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image || !title || !description || !category) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Upload image to Firebase Storage
            const imageRef = ref(storage, `projects/${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            // Add project to Firestore
            await addDoc(collection(db, 'projects'), {
                title,
                description,
                category,
                imageUrl,
                githubLink,
                liveLink,
                timestamp: new Date()
            });

            // Reset form
            setTitle('');
            setDescription('');
            setCategory('');
            setImage(null);
            setGithubLink('');
            setLiveLink('');
            
            alert('Project added successfully!');
        } catch (error) {
            console.error('Error adding project: ', error);
            alert('Error adding project. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Add New Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Project Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="web">Web Development</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="desktop">Desktop Applications</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Project Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">GitHub Link</label>
                    <input
                        type="url"
                        className="form-control"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/yourusername/project"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Live Demo Link</label>
                    <input
                        type="url"
                        className="form-control"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="https://your-project-demo.com"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Add Project
                </button>
            </form>
        </div>
    );
};

export default AddProject; 