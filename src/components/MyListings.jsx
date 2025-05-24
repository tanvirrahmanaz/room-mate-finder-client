import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const MyListings = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Like count helper function - handles different like data structures
  const getLikeCount = (item) => {
    if (Array.isArray(item.likes)) return item.likes.length;
    if (typeof item.likes === 'number') return item.likes;
    if (item.likeCount) return item.likeCount;
    if (item.likesCount) return item.likesCount;
    return 0;
  };

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
    const fetchMyListings = async () => {
      // Wait for auth context to load
      if (authLoading) return;

      // Check if user is authenticated
      if (!user) {
        toast.error("You must be logged in to view your listings");
        navigate('/login');
        return;
      }

      // Fetch user's listings if authenticated
      setLoading(true);
      try {
        const response = await fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setMyListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user, authLoading, navigate]);

  // SweetAlert2 Delete Confirmation
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You want to delete "<strong>${title}</strong>"?<br><small class="text-gray-500">This action cannot be undone!</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: theme === 'dark' ? '#4b5563' : '#6b7280',
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      background: theme === 'dark' ? '#1f2937' : '#ffffff',
      color: theme === 'dark' ? '#f9fafb' : '#111827',
      customClass: {
        popup: theme === 'dark' ? 'dark-popup' : '',
        title: theme === 'dark' ? 'text-white' : 'text-gray-900',
        htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }
    });

    if (result.isConfirmed) {
      setDeleteLoading(id);
      try {
        const res = await fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Success SweetAlert
          await Swal.fire({
            title: 'Deleted!',
            text: 'Your listing has been deleted successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          });
          
          setMyListings((prev) => prev.filter((item) => item._id !== id));
          toast.success('Listing deleted successfully');
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        // Error SweetAlert
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the listing. Please try again.',
          icon: 'error',
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
        });
        toast.error('Error deleting listing');
        console.error(error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Show loading while auth context is loading
  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Toaster />
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mb-4"></div>
          {/* Loading text */}
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Loading My Listings...
          </h2>
          {/* Sub text */}
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Checking authentication status
          </p>
          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated after auth loading is complete
  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
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
            Login Required
          </h2>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            You need to log in to view your listings. Please sign in to access your personal dashboard.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
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

  // Data loading state (after authentication)
  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto p-6 mt-6 rounded shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <Toaster />
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400 mb-4"></div>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-18 px-6 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'
    }`}>
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className={`rounded-xl shadow-sm p-6 mb-8 ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              My Roommate Listings
            </h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Manage your room listings and track their performance
            </p>
          </div>
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            {user?.displayName || user?.email || 'User'}
          </div>
        </div>
      </div>

      {myListings.length === 0 ? (
        <div className={`rounded-xl shadow-sm p-12 text-center ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <svg className={`w-10 h-10 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className={`text-2xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Listings Yet
          </h3>
          <p className={`mb-8 text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            You haven't added any roommate listings yet. Create your first listing to get started!
          </p>
          <Link
            to="/add-listing"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create First Listing
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Listings */}
            <div className={`rounded-xl p-6 shadow-sm border ${theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700' 
                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    Total Listings
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-blue-900'
                  }`}>
                    {myListings.length}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'
                }`}>
                  <svg className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Available Listings */}
            <div className={`rounded-xl p-6 shadow-sm border ${theme === 'dark' 
                ? 'bg-gradient-to-r from-green-900 to-green-800 border-green-700' 
                : 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-200' : 'text-green-600'
                  }`}>
                    Available
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-green-900'
                  }`}>
                    {myListings.filter(item => item.availability).length}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-green-800' : 'bg-green-200'
                }`}>
                  <svg className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-green-200' : 'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Not Available */}
            <div className={`rounded-xl p-6 shadow-sm border ${theme === 'dark' 
                ? 'bg-gradient-to-r from-red-900 to-red-800 border-red-700' 
                : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-600'
                  }`}>
                    Not Available
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-red-900'
                  }`}>
                    {myListings.filter(item => !item.availability).length}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-red-800' : 'bg-red-200'
                }`}>
                  <svg className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Likes */}
            <div className={`rounded-xl p-6 shadow-sm border ${theme === 'dark' 
                ? 'bg-gradient-to-r from-pink-900 to-pink-800 border-pink-700' 
                : 'bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-pink-200' : 'text-pink-600'
                  }`}>
                    Total Likes
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-pink-900'
                  }`}>
                    {myListings.reduce((total, item) => total + getLikeCount(item), 0)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-pink-800' : 'bg-pink-200'
                }`}>
                  <svg className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-pink-200' : 'text-pink-600'
                  }`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className={`rounded-xl shadow-sm overflow-hidden border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    {['Title', 'Location', 'Rent', 'Room Type', 'Likes', 'Status', 'Actions'].map((header) => (
                      <th key={header} className={`py-4 px-6 text-left text-sm font-semibold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {myListings.map((item) => (
                    <tr key={item._id} className={`transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-750' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <td className="py-4 px-6">
                        <div className={`font-semibold text-lg ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.title}
                        </div>
                      </td>
                      <td className={`py-4 px-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {item.location}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xl font-bold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          ${item.rentAmount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-blue-900 text-blue-200 border border-blue-800'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.roomType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center px-3 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-pink-900 border border-pink-800' : 'bg-pink-50 border border-pink-200'
                        }`}>
                          <svg className={`w-4 h-4 mr-2 ${
                            theme === 'dark' ? 'text-pink-400' : 'text-pink-500'
                          }`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                          }`}>
                            {getLikeCount(item)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            item.availability ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            item.availability
                              ? theme === 'dark'
                                ? 'bg-green-900 text-green-200 border border-green-800'
                                : 'bg-green-100 text-green-800 border border-green-200'
                              : theme === 'dark'
                                ? 'bg-red-900 text-red-200 border border-red-800'
                                : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {item.availability ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-3">
                          <Link
                            to={`/edit-listing/${item._id}`}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                              theme === 'dark'
                                ? 'text-blue-200 bg-blue-900 hover:bg-blue-800 border border-blue-800'
                                : 'text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200'
                            }`}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id, item.title)}
                            disabled={deleteLoading === item._id}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                              theme === 'dark'
                                ? 'text-red-200 bg-red-900 hover:bg-red-800 border border-red-800'
                                : 'text-red-700 bg-red-100 hover:bg-red-200 border border-red-200'
                            }`}
                          >
                            {deleteLoading === item._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`mt-8 rounded-xl shadow-sm p-6 border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h3>
                <p className={`mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage your listings efficiently
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/add-listing"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Listing
                </Link>
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    theme === 'dark'
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600 border border-gray-600'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;