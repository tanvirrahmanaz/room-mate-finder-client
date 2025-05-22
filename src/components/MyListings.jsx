import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ✅ Authentication check with loading
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Show loading for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast.error("You must be logged in to view your listings");
        navigate('/login');
        return;
      }
      
      setInitialLoading(false);
      
      // Fetch user's listings if authenticated
      try {
        const response = await fetch(`http://localhost:3000/rooms?email=${user.email}`);
        const data = await response.json();
        setMyListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [user, navigate]);

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

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Toaster />
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mb-4"></div>
          
          {/* Loading text */}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading My Listings...
          </h2>
          
          {/* Sub text */}
          <p className="text-gray-500 dark:text-gray-400">
            Checking authentication status
          </p>
          
          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Login Required
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to log in to view your listings. Please sign in to access your personal dashboard.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading your listings...</p>
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
          My Roommate Listings
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {user?.displayName || user?.email || 'User'}
        </div>
      </div>

      {myListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Listings Yet
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't added any roommate listings yet. Create your first listing to get started!
          </p>
          
          <Link
            to="/add-listing"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create First Listing
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Listings</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{myListings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Available</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {myListings.filter(item => item.availability).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Not Available</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {myListings.filter(item => !item.availability).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-4 px-6 font-semibold">Title</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Rent</th>
                  <th className="py-4 px-6 font-semibold">Room Type</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((item) => (
                  <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {item.location}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${item.rentAmount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {item.roomType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.availability 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                          item.availability ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        {item.availability ? 'Available' : 'Not Available'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/update/${item._id}`} 
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800 rounded-md transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleteLoading === item._id}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleteLoading === item._id ? (
                            <>
                              <div className="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
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
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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