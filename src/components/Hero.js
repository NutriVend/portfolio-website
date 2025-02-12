export default function Hero() {
    return (
        <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Welcome to My Portfolio</h1>
                    <p className="mt-4 text-xl text-gray-600">Software Developer & Problem Solver</p>
                    <div className="mt-6 flex justify-center space-x-6">
                        <a href="https://github.com/NutriVend" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                            <i className="fab fa-github mr-2"></i>GitHub
                        </a>
                        <a href="https://linkedin.com/in/woosikdwaynechung" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                            <i className="fab fa-linkedin mr-2"></i>LinkedIn
                        </a>
                        <a href="mailto:woosik@nutrivend.xyz" className="text-gray-700 hover:text-gray-900">
                            <i className="fas fa-envelope mr-2"></i>Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
} 