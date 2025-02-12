export default function Contact() {
    return (
        <div id="contact" className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Get In Touch</h2>
                <div className="flex justify-center space-x-6">
                    <a href="https://github.com/NutriVend" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 text-2xl">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://linkedin.com/in/woosikdwaynechung" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 text-2xl">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="mailto:woosik@nutrivend.xyz" className="text-gray-700 hover:text-gray-900 text-2xl">
                        <i className="fas fa-envelope"></i>
                    </a>
                </div>
            </div>
        </div>
    );
} 