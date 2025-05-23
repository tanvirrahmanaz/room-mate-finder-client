import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const [theme, setTheme] = useState('light');

  // LocalStorage থেকে theme load করা
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
  }, []);

  // Theme change detect করা
  useEffect(() => {
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme && (currentTheme === 'light' || currentTheme === 'dark')) {
        setTheme(currentTheme);
      }
    };

    // Storage event listener add করা
    window.addEventListener('storage', handleStorageChange);
    
    // Manual check করা (same tab এর জন্য)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme !== theme) {
        setTheme(currentTheme || 'light');
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dark' : ''}>
      <footer className={`relative overflow-hidden transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300'
          : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-700'
        } py-16 px-6`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute top-0 left-0 w-40 h-40 rounded-full -translate-x-20 -translate-y-20 ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          }`}></div>
          <div className={`absolute bottom-0 right-0 w-60 h-60 rounded-full translate-x-20 translate-y-20 ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          }`}></div>
          <div className={`absolute top-1/2 left-1/3 w-20 h-20 rounded-full ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          }`}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                  isDark ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <Heart className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-bold">RoomMate Finder</h3>
              </div>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Find your perfect roommate. Safe, easy and trusted platform for everyone.
              </p>
              <div className="flex space-x-3 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                  <Facebook size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-blue-400 text-gray-400 hover:text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 hover:bg-pink-600 text-gray-400 hover:text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <div className={`w-2 h-6 rounded-full mr-3 ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                }`}></div>
                Services
              </h4>
              <ul className="space-y-3">
                {[
                  'Find Roommates',
                  'User Dashboard',
                  'Safe Messaging',
                  'Verified Profiles',
                  'Advanced Search'
                ].map((service, index) => (
                  <li key={index} className={`text-sm hover:translate-x-1 transition-transform duration-200 cursor-pointer ${
                    isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <div className={`w-2 h-6 rounded-full mr-3 ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                }`}></div>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  'Sign Up',
                  'Log In',
                  'Help Center',
                  'Privacy Policy',
                  'Terms & Conditions'
                ].map((link, index) => (
                  <li
                    key={index}
                    className={`text-sm hover:translate-x-1 transition-transform duration-200 cursor-pointer ${
                      isDark 
                        ? 'text-gray-400 hover:text-blue-400' 
                        : 'text-black hover:text-gray-800'
                    }`}
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <div className={`w-2 h-6 rounded-full mr-3 ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                }`}></div>
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-center group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 group-hover:bg-blue-600'
                      : 'bg-blue-500 group-hover:bg-blue-600 text-white'
                  }`}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Phone</p>
                    <p className="text-sm font-medium">+880 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 group-hover:bg-blue-600'
                      : 'bg-blue-500 group-hover:bg-blue-600 text-white'
                  }`}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Email</p>
                    <p className="text-sm font-medium">support@roommatefinder.com</p>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-800 group-hover:bg-blue-600'
                      : 'bg-blue-500 group-hover:bg-blue-600 text-white'
                  }`}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Address</p>
                    <p className="text-sm font-medium">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center ${
            isDark ? 'border-gray-700' : 'border-blue-300 border-opacity-30'
          }`}>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              &copy; {new Date().getFullYear()} RoomMate Finder. All rights reserved.
            </div>
            <div className={`text-xs mt-4 md:mt-0 flex items-center ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <Heart size={12} className="mr-1 text-red-400" />
              Made with love in Bangladesh
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;