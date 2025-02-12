import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Add a new project
export const addProject = async (projectData) => {
    try {
        const docRef = await addDoc(collection(db, 'projects'), {
            ...projectData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

// Get all projects
export const getProjects = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting projects:', error);
        throw error;
    }
};

// Add category functions
export const addCategory = async (categoryName) => {
    try {
        const docRef = await addDoc(collection(db, 'categories'), {
            name: categoryName,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
};

// Add this function to check if categories collection exists
export const checkCategoriesCollection = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        console.log('Categories found:', querySnapshot.size);
        return querySnapshot.size > 0;
    } catch (error) {
        console.error('Error checking categories:', error);
        return false;
    }
}; 