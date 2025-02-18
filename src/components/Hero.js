import { useState, useEffect } from 'react';
import { databaseServices } from '../services/supabaseServices';

export default function Hero() {
    const [heroContent, setHeroContent] = useState({
        title: '',
        subtitle: '',
        videoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                // First try to get the content directly
                const { data, error } = await databaseServices.getCollection('hero_content');
                if (error) throw error;
                
                if (data && data.length > 0) {
                    setHeroContent(data[0]);
                } else {
                    // If no content exists, try to initialize and fetch again
                    await databaseServices.initializeTables();
                    const { data: newData } = await databaseServices.getCollection('hero_content');
                    if (newData && newData.length > 0) {
                        setHeroContent(newData[0]);
                    } else {
                        // If still no content, use default values
                        setHeroContent({
                            title: "Hi, I'm Woosik",
                            subtitle: "Mechanical Engineer, Bodybuilder, Fitness Coach, Software Developer, DIY & 3D printing Enthusiast, Problem Solver",
                            videoUrl: ""
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching hero content:', error);
                // Use default values on error
                setHeroContent({
                    title: "Hi, I'm Woosik",
                    subtitle: "Mechanical Engineer, Bodybuilder, Fitness Coach, Software Developer, DIY & 3D printing Enthusiast, Problem Solver",
                    videoUrl: ""
                });
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroContent();
    }, []);

    if (loading) {
        return (
            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded max-w-md mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center">
                    <div 
                        className="text-4xl font-bold text-gray-900"
                        dangerouslySetInnerHTML={{ __html: heroContent.title || "Hi, I'm Woosik" }}
                    />
                    <div 
                        className="mt-4 text-l text-gray-600"
                        dangerouslySetInnerHTML={{ __html: heroContent.subtitle || "Mechanical Engineer, Bodybuilder, Fitness Coach, Software Developer, DIY & 3D printing Enthusiast, Problem Solver" }}
                    />
                    {heroContent.videoUrl && (
                        <div className="mt-8 max-w-3xl mx-auto">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    src={heroContent.videoUrl}
                                    title="Portfolio Introduction"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    )}
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