export default function Projects() {
    return (
        <div id="projects" className="py-16 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">My Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src="https://placehold.co/400x200" alt="Project 1" className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="font-bold text-xl mb-2">Project Title</h3>
                            <p className="text-gray-600 mb-4">Brief description of the project and its key features.</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 