import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const BrowseListings = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Listen for theme changes in localStorage
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

  // Authentication and data fetching
  useEffect(() => {
    const fetchListings = async () => {
      // Wait for auth context to load
      if (authLoading) return;
      
      // Check if user is authenticated
      if (!user) {
        toast.error("You must be logged in to browse listings");
        navigate('/login');
        return;
      }
      
      // Fetch listings if user is authenticated
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/rooms');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, authLoading, navigate]);

  // Show loading while auth context is loading
  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Toaster />
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          
          {/* Loading text */}
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Loading Browse Listings...
          </h2>
          
          {/* Sub text */}
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Checking authentication status
          </p>
          
          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated after auth loading is complete
  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Toaster />
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === 'dark' ? 'bg-red-900' : 'bg-red-100'
            }`}>
              <svg className={`w-8 h-8 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Access Restricted
          </h2>
          
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            You need to log in to browse roommate listings. Please sign in to continue.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Toaster position="top-right" />
        
        {/* Header Section */}
        <div className={`rounded-lg shadow-sm p-6 mb-8 ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Roommate Listings
              </h1>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Find your perfect roommate and living space
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-sm px-3 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Welcome, {user?.displayName || user?.email || 'User'}
              </div>
              <Link
                to="/add-listing"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Loading listings...
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg className={`w-10 h-10 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Listings Found
              </h3>
              <p className={`mb-6 max-w-md mx-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                There are no roommate listings available at the moment. Be the first to add a listing!
              </p>
              <Link
                to="/add-listing"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add First Listing
              </Link>
            </div>
          ) : (
            <div className="p-6">
              {/* Stats */}
              <div className="mb-6">
                <p className={`text-sm flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Found {listings.length} listing{listings.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-300' 
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                      <th className="text-left py-4 px-6 font-semibold">Title</th>
                      <th className="text-left py-4 px-6 font-semibold">Location</th>
                      <th className="text-left py-4 px-6 font-semibold">Rent</th>
                      <th className="text-left py-4 px-6 font-semibold">Type</th>
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((item) => (
                      <tr key={item._id} className={`border-b transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <td className="py-4 px-6">
                          <div className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {item.location}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-green-600">
                            ${item.rentAmount}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'dark' 
                              ? 'bg-blue-900 text-blue-200' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.roomType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            item.availability 
                              ? theme === 'dark' 
                                ? 'bg-green-900 text-green-200' 
                                : 'bg-green-100 text-green-800'
                              : theme === 'dark'
                                ? 'bg-red-900 text-red-200'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.availability ? 'Available' : 'Not Available'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            to={`/details/${item._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {listings.map((item) => (
                  <div key={item._id} className={`rounded-lg p-4 border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-semibold text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <span className="font-semibold text-green-600">
                        ${item.rentAmount}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        📍 {item.location}
                      </p>
                      
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark' 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.roomType}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.availability 
                            ? theme === 'dark' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-green-100 text-green-800'
                            : theme === 'dark'
                              ? 'bg-red-900 text-red-200'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {item.availability ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/details/${item._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 w-full justify-center"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseListings;