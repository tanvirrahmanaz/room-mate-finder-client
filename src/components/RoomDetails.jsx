import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Authentication check with loading
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Show loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast.error("You must be logged in to view room details");
        navigate('/login');
        return;
      }
      
      setInitialLoading(false);
      
      // Fetch room details if user is authenticated
      try {
        const response = await fetch(`http://localhost:3000/rooms/${id}`);
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        console.error('Failed to load room details:', err);
        toast.error('Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [id, user, navigate]);

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Toaster />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Room Details...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Checking authentication status
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-900">
        <Toaster />
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to view room details and contact information.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <Toaster />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-900">
        <Toaster />
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Room Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The room you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Browse All Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <Toaster position="top-right" />
      
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <Link to="/browse" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
                Browse Listings
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Room Details</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{room.title}</h1>
              <div className="flex items-center text-indigo-100">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-lg">{room.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${room.rentAmount}</div>
              <div className="text-indigo-200">per month</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Room Type</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {room.roomType}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Availability</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      room.availability 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      <span className={`w-2 h-2 mr-2 rounded-full ${room.availability ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {room.availability ? 'Available Now' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifestyle Preferences */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  Lifestyle Preferences
                </h2>
                <div className="flex flex-wrap gap-3">
                  <div className={`flex items-center px-4 py-2 rounded-lg ${
                    room.lifestylePrefs?.pets 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    <span className="text-lg mr-2">🐕</span>
                    <span className="font-medium">Pets {room.lifestylePrefs?.pets ? 'Welcome' : 'Not Allowed'}</span>
                  </div>
                  
                  <div className={`flex items-center px-4 py-2 rounded-lg ${
                    room.lifestylePrefs?.smoking 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    <span className="text-lg mr-2">🚬</span>
                    <span className="font-medium">Smoking {room.lifestylePrefs?.smoking ? 'Allowed' : 'Not Allowed'}</span>
                  </div>
                  
                  <div className={`flex items-center px-4 py-2 rounded-lg ${
                    room.lifestylePrefs?.nightOwl 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    <span className="text-lg mr-2">🌙</span>
                    <span className="font-medium">Night Owl {room.lifestylePrefs?.nightOwl ? 'Friendly' : 'Quiet Hours'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Description
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Posted by</div>
                      <div className="font-medium text-gray-900 dark:text-white">{room.userName || 'Anonymous'}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium text-gray-900 dark:text-white break-all">{room.userEmail}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Contact</div>
                      <div className="font-medium text-gray-900 dark:text-white">{room.contactInfo}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Send Email
                  </button>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call Now
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Rent</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${room.rentAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Room Type</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{room.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`font-semibold ${room.availability ? 'text-green-600' : 'text-red-600'}`}>
                      {room.availability ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <Link
          to="/browse-listings"
          className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Listings
        </Link>
      </div>
    </div>
  );
};

export default RoomDetails;