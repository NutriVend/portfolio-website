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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image || !title || !description || !category || !startDate || !endDate) {
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
                startDate,
                endDate,
                timestamp: new Date()
            });

            // Reset form
            setTitle('');
            setDescription('');
            setCategory('');
            setImage(null);
            setGithubLink('');
            setLiveLink('');
            setStartDate('');
            setEndDate('');
            
            alert('Project added successfully!');
        } catch (error) {
            console.error('Error adding project: ', error);
            alert('Error adding project. Please try again.');
        }
    };

    return (
        <div className="add-project-container">
            <h1>Add New Project</h1>
            
            <form className="project-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="category">Category</label>
                    <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="Fitness">Fitness</option>
                        <option value="web">Web Development</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="desktop">Desktop Applications</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label for="projectName">Project Name</label>
                    <input type="text" id="projectName" name="projectName" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label for="startDate">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Project Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">GitHub Link</label>
                    <input
                        type="url"
                        className="form-control"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/yourusername/project"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Live Demo Link</label>
                    <input
                        type="url"
                        className="form-control"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="https://your-project-demo.com"
                    />
                </div>

                <button type="submit" className="submit-btn">Create Project</button>
            </form>
        </div>
    );
};

export default AddProject;

.add-project-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
}

input, select, textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
} 