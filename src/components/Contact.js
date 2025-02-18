export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-center mb-8">Get In Touch</h1>
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center space-y-8">
                    <p className="text-gray-600 text-center mb-6">
                        Feel free to connect with me through any of these platforms:
                    </p>
                    <div className="flex justify-center space-x-8">
                        <a href="https://github.com/NutriVend" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-gray-700 hover:text-gray-900 text-3xl transition-colors duration-200">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://linkedin.com/in/woosikdwaynechung" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-gray-700 hover:text-gray-900 text-3xl transition-colors duration-200">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="mailto:woosik@nutrivend.xyz" 
                           className="text-gray-700 hover:text-gray-900 text-3xl transition-colors duration-200">
                            <i className="fas fa-envelope"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}