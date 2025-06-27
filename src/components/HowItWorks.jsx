import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Handshake, 
  Shield, 
  Star, 
  MessageCircle, 
  CheckCircle,
  Users,
  MapPin,
  Clock
} from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: 'Create Your Profile',
    description: 'Sign up for free and create a detailed profile about your lifestyle, preferences, and what you are looking for in a roommate.',
    features: ['Free Registration', 'Detailed Preferences', 'Photo Upload'],
    time: '2 mins'
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: 'Search & Filter',
    description: 'Browse through thousands of listings with advanced filters like location, budget, habits, and more to find the perfect match.',
    features: ['Advanced Filters', 'Location Based', 'Budget Range'],
    time: '5 mins'
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: 'Connect & Move In',
    description: 'Once you find a potential match, connect with them through our secure chat and schedule a visit. Find your new home!',
    features: ['Secure Chat', 'Schedule Visits', 'Safe Meetings'],
    time: '1-2 days'
  },
];

const stats = [
  { icon: <Users className="w-6 h-6" />, value: '50K+', label: 'Active Users' },
  { icon: <CheckCircle className="w-6 h-6" />, value: '25K+', label: 'Successful Matches' },
  { icon: <MapPin className="w-6 h-6" />, value: '100+', label: 'Cities Covered' },
  { icon: <Star className="w-6 h-6" />, value: '4.8', label: 'User Rating' }
];

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Verified Users',
    description: 'All profiles are verified to ensure safety and authenticity for genuine connections.'
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Smart Filtering',
    description: 'Advanced search filters by location, budget, habits, and preferences for the perfect matches.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Active Community',
    description: 'Join thousands of active users finding roommates in your area every single day.'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Easy Process',
    description: 'Simple 3-step process: Create profile, search listings, connect with potential roommates.'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Support',
    description: 'Round the clock customer support to help you throughout your roommate search journey.'
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Perfect Matches',
    description: 'Our smart algorithm helps you find compatible roommates based on your lifestyle and preferences.'
  }
];

const HowItWorks = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    };
    window.addEventListener('storage', handleThemeChange);
    const interval = setInterval(handleThemeChange, 100);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`py-20 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            theme === 'dark' 
              ? 'bg-purple-900/30 text-purple-300 border border-purple-700' 
              : 'bg-purple-100 text-purple-700 border border-purple-200'
          }`}>
            <Star className="w-4 h-4 mr-2" />
            Why Choose RoomMate Finder?
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            How It <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            The most trusted platform to find your perfect roommate. Join thousands of satisfied users 
            who found their ideal living companions through our secure and user-friendly platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white/70 border border-gray-200 shadow-lg'
            }`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
              }`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Steps */}
        <div className="mb-20">
          <h3 className={`text-3xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Get Started in 3 Simple Steps
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2 z-0"></div>
            
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative z-10 text-center p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                  activeStep === index 
                    ? (theme === 'dark' 
                        ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 shadow-2xl scale-105' 
                        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-2xl scale-105')
                    : (theme === 'dark' 
                        ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70' 
                        : 'bg-white/80 border border-gray-200 hover:bg-white shadow-lg hover:shadow-xl')
                } transform hover:scale-105`}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Number */}
                <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                }`}>
                  {index + 1}
                </div>

                {/* Time Badge */}
                <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {step.time}
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : (theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600')
                }`}>
                  {step.icon}
                </div>

                <h3 className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                
                <p className={`text-base mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className={`flex items-center justify-center text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                    : (theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400')
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className={`text-3xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose Our Platform?
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70' 
                  : 'bg-white/80 border border-gray-200 hover:bg-white shadow-lg hover:shadow-xl'
              }`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  {feature.icon}
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div className={`p-8 rounded-2xl text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700' 
            : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200'
        }`}>
          <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'
          }`}>
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          
          <blockquote className={`text-lg md:text-xl italic mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            "RoomMate Finder made finding my perfect roommate so easy! The verification 
            process gave me confidence, and the filters helped me find someone with similar 
            lifestyle preferences. Highly recommended!"
          </blockquote>
          
          <div className={`flex items-center justify-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className={`w-10 h-10 rounded-full mr-3 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
            <div>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm">Happy Customer</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Find Your Perfect Roommate?
          </h3>
          <p className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of satisfied users who found their ideal living companions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Search Today
            </button>
            <button className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-lg'
            }`}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;