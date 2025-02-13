import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadProjectImage = async (file) => {
    try {
        const filename = `projects/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, filename);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadBlogImage = async (file) => {
    try {
        const filename = `blog-images/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, filename);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
    } catch (error) {
        console.error('Error uploading blog image:', error);
        throw error;
    }
};