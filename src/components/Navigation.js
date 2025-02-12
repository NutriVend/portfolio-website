export default function Navigation() {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            <a href="https://app.nutrivend.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center py-4">
                                <span className="font-semibold text-gray-800 text-lg">NutriVend</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <a href="#about" className="py-4 px-2 text-gray-700 hover:text-gray-900">About</a>
                        <a href="#projects" className="py-4 px-2 text-gray-700 hover:text-gray-900">Projects</a>
                        <a href="#contact" className="py-4 px-2 text-gray-700 hover:text-gray-900">Contact</a>
                    </div>
                </div>
            </div>
        </nav>
    );
} 