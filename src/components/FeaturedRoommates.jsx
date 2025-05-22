import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const FeaturedRoommates = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/rooms/available?limit=6')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Handle See More click with authentication check
  const handleSeeMoreClick = (postId) => {
    if (!user) {
      toast.error("Please log in to view details");
      navigate('/login');
      return;
    }
    // If user is logged in, navigate to details
    navigate(`/details/${postId}`);
  };

  if (loading) {
    return (
      <div className="my-10 px-4 max-w-7xl mx-auto">
        <Toaster />
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Featured Roommate Posts
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Featured Roommate Posts
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the latest available roommate opportunities
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Featured Posts Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for new roommate listings
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post._id} className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-2 flex-shrink-0">
                    Available
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center mb-3">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{post.location}</span>
                </div>

                {/* Rent */}
                <div className="flex items-center mb-4">
                  <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                    ${post.rentAmount}
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/month</span>
                  </span>
                </div>

                {/* Room Type */}
                {post.roomType && (
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {post.roomType}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                  {post.description}
                </p>

                {/* Lifestyle Preferences */}
                {post.lifestylePrefs && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.lifestylePrefs.pets && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        🐕 Pets OK
                      </span>
                    )}
                    {post.lifestylePrefs.smoking && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        🚬 Smoking OK
                      </span>
                    )}
                    {post.lifestylePrefs.nightOwl && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        🌙 Night Owl
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleSeeMoreClick(post._id)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 group-hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span>See Details</span>
                  <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                {!user && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Login required to view details
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              if (!user) {
                toast.error("Please log in to browse all listings");
                navigate('/login');
                return;
              }
              navigate('/browse');
            }}
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Listings
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedRoommates;