import React, { useState, useEffect } from 'react';
import { Quote, Star, MessageCircle, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestimonialSection = () => {
    const [isDark, setIsDark] = useState(false);

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

    // Step 1: Import necessary hooks
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    // Step 2: Create a handler function for the button click
    const handleGetStartedClick = () => {
        if (user) {
            // If user is logged in, navigate to add listing page
            navigate('/add-listing');
        } else {
            // If not logged in, navigate to browse page
            navigate('/browse');
        }
    };

    const testimonials = [
        {
            name: "Mahin Rahman",
            location: "Dhaka",
            rating: 5,
            text: "I found my perfect roommate within 2 days. The platform is clean and easy to use!",
            avatar: "M"
        },
        {
            name: "Fatima Akter",
            location: "Chittagong",
            rating: 5,
            text: "Amazing experience! The verification process made me feel safe while searching for roommates.",
            avatar: "F"
        },
        {
            name: "Rakib Hassan",
            location: "Sylhet",
            rating: 5,
            text: "Best roommate finder in Bangladesh. Found compatible roommates who became great friends!",
            avatar: "R"
        }
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
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        What <span className={isDark ? 'text-purple-400' : 'text-blue-600'}>Users Say</span>
                    </h2>
                    <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Don't just take our word for it. Here's what our satisfied users have to say about their experience finding roommates.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="group">
                            <div className={`rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 h-full relative ${
                                isDark 
                                    ? 'bg-slate-800 shadow-xl shadow-purple-900/20 border-slate-600 hover:shadow-purple-900/30' 
                                    : 'bg-white shadow-lg border-blue-200 hover:shadow-xl hover:border-blue-300'
                            }`}>
                                {/* Quote Icon */}
                                <div className={`absolute top-4 right-4 ${
                                    isDark ? 'text-purple-400' : 'text-blue-400'
                                } opacity-20`}>
                                    <Quote className="w-8 h-8" />
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 fill-current ${
                                            isDark ? 'text-yellow-400' : 'text-yellow-500'
                                        }`} />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className={`text-lg leading-relaxed mb-6 italic ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    "{testimonial.text}"
                                </p>

                                {/* User Info */}
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                                        isDark 
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                    }`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className={`font-bold ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {testimonial.name}
                                        </div>
                                        <div className={`text-sm ${
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {testimonial.location}, Bangladesh
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Overall Rating Section */}
                <div className={`rounded-2xl p-8 text-center border ${
                    isDark 
                        ? 'bg-slate-800 shadow-xl shadow-purple-900/20 border-slate-600' 
                        : 'bg-white shadow-lg border-blue-200'
                }`}>
                    <div className="max-w-2xl mx-auto">
                        <div className={`text-6xl font-bold mb-4 ${
                            isDark ? 'text-purple-400' : 'text-blue-600'
                        }`}>
                            4.9/5
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-8 h-8 fill-current ${
                                    i < 5 ? (isDark ? 'text-yellow-400' : 'text-yellow-500') : 'text-gray-300'
                                }`} />
                            ))}
                        </div>
                        <p className={`text-xl mb-2 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Excellent Rating
                        </p>
                        <p className={`${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Based on 15,000+ user reviews
                        </p>
                    </div>
                </div>

               <div className="text-center mt-16">
                    <p className="text-lg mb-6 text-base-content/80">
                        Join thousands of satisfied users today!
                    </p>
                    {/* Step 3: Attach the handler and use DaisyUI classes for styling */}
                    <button 
                        onClick={handleGetStartedClick}
                        className="btn btn-primary btn-lg rounded-full shadow-lg transform hover:scale-105"
                    >
                        Get Started Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestimonialSection;