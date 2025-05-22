import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const BrowseListings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Authentication check with loading
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Show loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast.error("You must be logged in to browse listings");
        navigate('/login');
        return;
      }
      
      setInitialLoading(false);
      
      // Fetch listings if user is authenticated
      try {
        const response = await fetch('http://localhost:3000/rooms');
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [user, navigate]);

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Toaster />
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400 mb-4"></div>
          
          {/* Loading text */}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Browse Listings...
          </h2>
          
          {/* Sub text */}
          <p className="text-gray-500 dark:text-gray-400">
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

  // If user is not authenticated after loading
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-900">
        <Toaster />
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Access Restricted
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to log in to browse roommate listings. Please sign in to continue.
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
      <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 rounded shadow-md">
        <Toaster />
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <Toaster position="top-right" />
      
      {/* Header with user info */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Roommate Listings
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Welcome, {user?.displayName || user?.email || 'User'}
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Listings Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There are no roommate listings available at the moment.
          </p>
          <Link
            to="/add-listing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add First Listing
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((item) => (
                  <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {item.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${item.rentAmount}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.roomType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.availability 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {item.availability ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/details/${item._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
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

export default BrowseListings;