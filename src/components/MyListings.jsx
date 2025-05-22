import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

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
        const response = await fetch(`http://localhost:3000/rooms?email=${user.email}`);
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

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`http://localhost:3000/rooms/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('Listing deleted successfully');
        setMyListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (error) {
      toast.error('Error deleting listing');
      console.error(error);
    } finally {
      setDeleteLoading(null);
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
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
    <div className={`max-w-6xl mx-auto p-6 mt-6 rounded shadow-md ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <Toaster position="top-right" />
      
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          My Roommate Listings
        </h2>
        <div className={`text-sm px-3 py-2 rounded ${
          theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'
        }`}>
          {user?.displayName || user?.email || 'User'}
        </div>
      </div>

      {myListings.length === 0 ? (
        <div className="text-center py-10">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <svg className={`w-8 h-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          
          <h3 className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Listings Yet
          </h3>
          
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            You haven't added any roommate listings yet. Create your first listing to get started!
          </p>
          
          <Link
            to="/add-listing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create First Listing
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-white' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Total Listings
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {myListings.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-green-600' : 'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-white' : 'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Available
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {myListings.filter(item => item.availability).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-red-50'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-red-600' : 'bg-red-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-white' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Not Available
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {myListings.filter(item => !item.availability).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className={`text-left ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((item) => (
                  <tr key={item._id} className={`border-b transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-700 hover:bg-gray-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <td className="py-3 px-4">
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ${item.rentAmount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.roomType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-listing/${item._id}`}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'text-blue-200 bg-blue-900 hover:bg-blue-800' 
                              : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(item._id)}
                          disabled={deleteLoading === item._id}
                          className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === 'dark' 
                              ? 'text-red-200 bg-red-900 hover:bg-red-800' 
                              : 'text-red-700 bg-red-100 hover:bg-red-200'
                          }`}
                        >
                          {deleteLoading === item._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Add new listing button */}
          <div className="mt-6 text-center">
            <Link
              to="/add-listing"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Listing
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MyListings;