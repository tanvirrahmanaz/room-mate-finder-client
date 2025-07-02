import React, { useState, useEffect } from 'react';
import { Mail, Check, ArrowRight, Users, Home, Star } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Listen for theme changes - synced with navbar
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  const benefits = [
    {
      icon: <Home className="w-5 h-5" />,
      text: "New verified listings first"
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Perfect roommate matching tips"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "Exclusive member discounts"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      
      
      
      
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-xl transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-purple-500/25' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-purple-500/30'
          }`}>
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h2 className={`text-5xl md:text-6xl font-bold mb-8 transition-all duration-500 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Stay in the{' '}
            <span className={`bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
              isDark 
                ? 'from-blue-400 to-purple-400' 
                : 'from-blue-600 to-purple-600'
            }`}>
              Loop
            </span>
          </h2>
          
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-500 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of users who get exclusive access to premium listings, 
            expert roommate tips, and special offers before anyone else.
          </p>

          {/* Enhanced Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 backdrop-blur-lg rounded-2xl px-6 py-3 border transition-all duration-500 hover:scale-105 transform ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-white/70 border-gray-200/50 text-gray-700 hover:bg-white/90 hover:shadow-lg'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {benefit.icon}
                </div>
                <span className="font-semibold text-lg">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Newsletter Form */}
        <div className="max-w-3xl mx-auto">
          {!isSubscribed ? (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-8 py-5 text-xl backdrop-blur-lg border rounded-3xl focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-500 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-blue-500/30 focus:bg-white/10' 
                      : 'bg-white/80 border-gray-200/50 text-gray-800 placeholder-gray-500 focus:ring-blue-500/20 focus:bg-white/95 shadow-lg'
                  }`}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className={`px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-3xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-500 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3 min-w-[200px] shadow-xl ${
                  isDark ? 'shadow-purple-500/25' : 'shadow-purple-500/30'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className={`text-center backdrop-blur-lg rounded-3xl p-12 border transition-all duration-500 shadow-xl ${
              isDark 
                ? 'bg-white/5 border-white/10 shadow-green-500/10' 
                : 'bg-white/80 border-gray-200/50 shadow-green-500/20'
            }`}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className={`text-3xl font-bold mb-4 transition-all duration-500 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>You're All Set!</h3>
              <p className={`text-xl transition-all duration-500 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Welcome to the RoomMate Finder community. Check your inbox for a confirmation email.
              </p>
            </div>
          )}

          {/* Enhanced Trust indicators */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-8 mt-12 text-lg transition-all duration-500 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">50,000+ subscribers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span className="font-medium">Weekly updates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span className="font-medium">Unsubscribe anytime</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { number: '50K+', label: 'Active Users', color: 'from-green-400 to-emerald-500' },
            { number: '25K+', label: 'Successful Matches', color: 'from-blue-400 to-cyan-500' },
            { number: '100+', label: 'Cities Covered', color: 'from-purple-400 to-violet-500' },
            { number: '4.8', label: 'User Rating', color: 'from-indigo-400 to-blue-500' }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-all duration-500 group-hover:scale-110`}>
                {stat.number}
              </div>
              <div className={`text-lg font-medium transition-all duration-500 ${
                isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;