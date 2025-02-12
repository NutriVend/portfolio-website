import { addProject, getCategories } from '../firebase/firestore';
import AdminNav from './AdminNav';

export default function AddProject() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... existing validation ...
        
        const projectData = {
            // ... existing project data ...
            category: selectedCategory,
        };
        
        // ... rest of submit logic ...
    };

    return (
        <div>
            <AdminNav />
            <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... existing form fields ... */}
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* ... rest of form ... */}
                </form>
            </div>
        </div>
    );
} 