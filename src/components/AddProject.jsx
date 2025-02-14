import { databaseServices } from '../services/firebaseServices';
// ...existing code...

const AddProject = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  // ...existing code...

  const handleImageUpload = async (imageUrl, metadata) => {
    try {
      setUploadStatus('Uploading image...');
      await databaseServices.uploadImageMetadata({
        url: imageUrl,
        metadata: {
          ...metadata,
          type: 'project',
          uploadedAt: new Date().toISOString()
        }
      });
      setUploadStatus('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  // ...existing code...
};
