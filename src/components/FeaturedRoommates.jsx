import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaMapMarkerAlt, FaBed, FaMoneyBillWave, FaEye, FaFilter, FaSearch } from 'react-icons/fa';

const FeaturedRoommates = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    roomType: '',
    minRent: '',
    maxRent: '',
    sortBy: 'newest'
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

  // Fetch posts with better error handling
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching posts from server...');
        const response = await fetch('https://room-mate-finder-server-zeta.vercel.app/rooms/available?limit=12', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        // Check if data is an array or has a data property
        const postsData = Array.isArray(data) ? data : (data.data || data.rooms || []);
        
        if (!Array.isArray(postsData)) {
          console.error('Invalid data format received:', data);
          throw new Error('Invalid data format received from server');
        }

        setPosts(postsData);
        setFilteredPosts(postsData);
        
        if (postsData.length === 0) {
          console.log('No posts found');
        }
        
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
        toast.error(`Error loading posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on filter criteria
  useEffect(() => {
    if (!Array.isArray(posts) || posts.length === 0) {
      setFilteredPosts([]);
      return;
    }

    let filtered = [...posts];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(post =>
        (post.title && post.title.toLowerCase().includes(filters.search.toLowerCase())) ||
        (post.location && post.location.toLowerCase().includes(filters.search.toLowerCase())) ||
        (post.description && post.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(post =>
        post.location && post.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Room type filter
    if (filters.roomType) {
      filtered = filtered.filter(post =>
        post.roomType && post.roomType.toLowerCase() === filters.roomType.toLowerCase()
      );
    }

    // Rent range filter
    if (filters.minRent) {
      filtered = filtered.filter(post => 
        post.rentAmount && post.rentAmount >= parseInt(filters.minRent)
      );
    }
    if (filters.maxRent) {
      filtered = filtered.filter(post => 
        post.rentAmount && post.rentAmount <= parseInt(filters.maxRent)
      );
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      const getLikeCount = (post) => {
        if (Array.isArray(post.likes)) return post.likes.length;
        if (typeof post.likes === 'number') return post.likes;
        if (post.likeCount) return post.likeCount;
        return 0;
      };

      switch (filters.sortBy) {
        case 'mostLiked':
          return getLikeCount(b) - getLikeCount(a);
        case 'leastLiked':
          return getLikeCount(a) - getLikeCount(b);
        case 'priceHigh':
          return (b.rentAmount || 0) - (a.rentAmount || 0);
        case 'priceLow':
          return (a.rentAmount || 0) - (b.rentAmount || 0);
        case 'oldest':
          return new Date(a.createdAt || a.datePosted || 0) - new Date(b.createdAt || b.datePosted || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || b.datePosted || 0) - new Date(a.createdAt || a.datePosted || 0);
      }
    });

    // Limit to 6 for featured display
    setFilteredPosts(filtered.slice(0, 6));
  }, [filters, posts]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      roomType: '',
      minRent: '',
      maxRent: '',
      sortBy: 'newest'
    });
  };

  // Get unique values for filter options
  const getUniqueValues = (key) => {
    if (!Array.isArray(posts)) return [];
    return [...new Set(posts.map(post => post[key]).filter(Boolean))];
  };

  // Handle See More click with authentication check
  const handleSeeMoreClick = (postId) => {
    if (!user) {
      toast.error("Please log in to view details");
      navigate('/login');
      return;
    }
    navigate(`/details/${postId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className={`my-10 px-4 max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <Toaster />
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Featured Roommate Posts
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className={`card shadow-md p-6 rounded-lg animate-pulse ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } border`}
            >
              <div className={`h-6 rounded mb-4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded mb-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded mb-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-16 rounded mb-4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-8 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`p-10 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Toaster />
        <div className="text-center py-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            theme === 'dark' ? 'bg-red-900' : 'bg-red-100'
          }`}>
            <svg 
              className={`w-10 h-10 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className={`text-xl font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Failed to Load Posts
          </h3>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-10 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      />
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Featured Roommate Posts
        </h2>
        <p className={`transition-colors duration-200 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Discover the latest available roommate opportunities • {filteredPosts.length} results
        </p>
      </div>

      {/* Filter Section */}
      <div className={`rounded-xl p-6 mb-8 shadow-sm max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Filter & Search
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Search Bar - Always Visible */}
        <div className="relative mb-4">
          <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search posts..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Sort By */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostLiked">Most Liked</option>
                  <option value="leastLiked">Least Liked</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Room Type Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">All Types</option>
                  {getUniqueValues('roomType').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Min Rent */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Min Rent
                </label>
                <input
                  type="number"
                  placeholder="Min rent"
                  value={filters.minRent}
                  onChange={(e) => handleFilterChange('minRent', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Max Rent */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Max Rent
                </label>
                <input
                  type="number"
                  placeholder="Max rent"
                  value={filters.maxRent}
                  onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'}
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <svg 
              className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className={`text-xl font-medium mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {posts.length === 0 ? 'No Featured Posts Available' : 'No Results Found'}
          </h3>
          <p className={`mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {posts.length === 0 
              ? 'Check back later for new roommate listings' 
              : 'Try adjusting your filters to find more posts.'
            }
          </p>
          {posts.length > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredPosts.map(post => (
            <div 
              key={post._id} 
              className={`group shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-xl font-semibold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.title || 'Untitled Post'}
                  </h3>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {/* Like Count */}
                    <span className="flex items-center text-sm font-medium text-pink-500">
                      <FaHeart className="mr-1" />
                      {(() => {
                        // Handle different like count formats from backend
                        if (Array.isArray(post.likes)) return post.likes.length;
                        if (typeof post.likes === 'number') return post.likes;
                        if (post.likeCount) return post.likeCount;
                        if (post.likesCount) return post.likesCount;
                        return 0;
                      })()}
                    </span>
                    {/* Available Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Available
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className={`mr-2 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {post.location || 'Location not specified'}
                  </span>
                </div>

                {/* Rent and Room Type */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    <span className="font-semibold text-green-600">
                      ${post.rentAmount || 0}/mo
                    </span>
                  </div>
                  {post.roomType && (
                    <div className="flex items-center">
                      <FaBed className="mr-2 text-blue-500" />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {post.roomType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className={`text-sm line-clamp-3 mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {post.description || 'No description available'}
                </p>

                {/* Lifestyle Preferences */}
                {post.lifestylePrefs && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.lifestylePrefs.pets && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' 
                          ? 'bg-yellow-900 text-yellow-200' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        🐕 Pets OK
                      </span>
                    )}
                    {post.lifestylePrefs.smoking && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' 
                          ? 'bg-orange-900 text-orange-200' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        🚬 Smoking OK
                      </span>
                    )}
                    {post.lifestylePrefs.nightOwl && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
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
                  <FaEye className="mr-2" />
                  <span>See Details</span>
                </button>
                {!user && (
                  <p className={`text-xs text-center mt-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Login required to view details
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/browse')}
            className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
          >
            View All Listings
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedRoommates;