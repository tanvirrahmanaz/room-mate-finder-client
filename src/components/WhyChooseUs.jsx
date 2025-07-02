import React, { useState, useEffect } from 'react';
import { Shield, Search, Users, CheckCircle, Clock, Heart, Star, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhyChooseUs = () => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();

    // Listen for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            const savedTheme = localStorage.getItem('theme') || 'light';
            const darkMode = savedTheme === 'dark';
            setIsDark(darkMode);
            
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        handleThemeChange();
        window.addEventListener('storage', handleThemeChange);
        const interval = setInterval(handleThemeChange, 100);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            clearInterval(interval);
        };
    }, []);

    const features = [
        {
            icon: Shield,
            title: 'Verified Users',
            description: 'All profiles are verified to ensure safety and authenticity for genuine connections.',
            color: isDark ? 'text-green-400' : 'text-green-600'
        },
        {
            icon: Search,
            title: 'Smart Filtering',
            description: 'Advanced search filters by location, budget, lifestyle, and preferences to find perfect matches.',
            color: isDark ? 'text-blue-400' : 'text-blue-600'
        },
        {
            icon: Users,
            title: 'Active Community',
            description: 'Join thousands of active users finding roommates in your area every day.',
            color: isDark ? 'text-purple-400' : 'text-purple-600'
        },
        {
            icon: CheckCircle,
            title: 'Easy Process',
            description: 'Simple 3-step process: Create profile, browse listings, connect with matches.',
            color: isDark ? 'text-indigo-400' : 'text-indigo-600'
        },
        {
            icon: Clock,
            title: '24/7 Support',
            description: 'Round-the-clock customer support to help you throughout your roommate search journey.',
            color: isDark ? 'text-orange-400' : 'text-orange-600'
        },
        {
            icon: Heart,
            title: 'Perfect Matches',
            description: 'Our smart algorithm helps you find compatible roommates based on your lifestyle and preferences.',
            color: isDark ? 'text-red-400' : 'text-red-600'
        }
    ];

    const stats = [
        { number: '50K+', label: 'Happy Users' },
        { number: '25K+', label: 'Successful Matches' },
        { number: '100+', label: 'Cities Covered' },
        { number: '4.8', label: 'User Rating' }
    ];

    return (
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                        isDark 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}>
                        <Star className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Why Choose <span className={isDark ? 'text-purple-400' : 'text-blue-600'}>RoomMate Finder?</span>
                    </h2>
                    <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
                        isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                        The most trusted platform to find your perfect roommate. Join thousands of satisfied users who found their ideal living companions through our secure and user-friendly platform.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className={`rounded-2xl p-6 border transition-all duration-300 group-hover:scale-105 ${
                                isDark 
                                    ? 'bg-slate-800 shadow-xl shadow-purple-900/20 border-slate-600 hover:shadow-purple-900/30' 
                                    : 'bg-white shadow-lg border-blue-200 hover:shadow-xl hover:border-blue-300'
                            }`}>
                                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                                    isDark ? 'text-purple-400' : 'text-blue-600'
                                }`}>
                                    {stat.number}
                                </div>
                                <div className={`font-medium ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="group">
                                <div className={`rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 h-full ${
                                    isDark 
                                        ? 'bg-slate-800 shadow-xl shadow-purple-900/20 border-slate-600 hover:shadow-purple-900/30' 
                                        : 'bg-white shadow-lg border-blue-200 hover:shadow-xl hover:border-blue-300'
                                }`}>
                                    <div className="flex items-center mb-6">
                                        <div className={`w-12 h-12 bg-opacity-10 rounded-xl flex items-center justify-center mr-4 ${
                                            isDark ? feature.color + ' bg-opacity-20' : feature.color + ' bg-opacity-10'
                                        }`}>
                                            <IconComponent className={`w-6 h-6 ${feature.color}`} />
                                        </div>
                                        <h3 className={`text-xl font-bold ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className={`leading-relaxed ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Testimonial Section */}
                <div className={`rounded-3xl p-8 md:p-12 text-center text-white shadow-lg ${
                    isDark 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-700 shadow-purple-900/30' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-900/30'
                }`}>
                    <div className="max-w-4xl mx-auto">
                        <MessageCircle className="w-12 h-12 mx-auto mb-6 opacity-80" />
                        <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                            "RoomMate Finder made finding my perfect roommate so easy! The verification process gave me confidence, and the filters helped me find someone with similar lifestyle preferences. Highly recommended!"
                        </blockquote>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold">Sarah Rahman</div>
                                <div className={isDark ? 'text-purple-200' : 'text-blue-200'}>
                                    Dhaka, Bangladesh
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Updated CTA Section */}
        <div className="text-center mt-16">
            <p className="text-lg mb-6 text-base-content/80">
                Ready to find your new home?
            </p>
            <div className="inline-flex items-center justify-center space-x-4">
                {/* Button 1: Start Search */}
                <button 
                    onClick={() => navigate('/browse')}
                    className="btn btn-primary btn-lg rounded-full shadow-lg transform hover:scale-105"
                >
                    Start Your Search Today
                </button>
                
                {/* Button 2: Learn More */}
                <button
                    onClick={() => navigate('/about')} 
                    className="btn btn-secondary btn-outline btn-lg rounded-full"
                >
                    Learn More
                </button>
            </div>
        </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;