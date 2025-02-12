export const uploadProjectImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', '2c28a50036ab1cf5675f2ac9a6192219'); // Replace with your API key

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Add this test function temporarily
export const testImgBBConnection = async () => {
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`);
        console.log('ImgBB API Response:', response.status);
    } catch (error) {
        console.error('ImgBB Connection Error:', error);
    }
}; 