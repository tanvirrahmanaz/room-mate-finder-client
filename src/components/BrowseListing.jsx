import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaMapMarkerAlt, FaBed, FaMoneyBillWave, FaEye, FaFilter, FaSearch } from 'react-icons/fa';

const BrowseListings = () => {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Initialize theme immediately from localStorage
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    roomType: '',
    minRent: '',
    maxRent: '',
    availability: 'all',
    sortBy: 'newest'
  });

  // Optimized theme effect - much faster response
  useEffect(() => {
    const updateTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme !== theme) {
          setTheme(savedTheme);
        }
      } catch {
        console.error('Error reading theme from localStorage');
      }
    };

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };

    // Listen for custom theme change events
    const handleThemeChange = () => {
      updateTheme();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChanged', handleThemeChange);

    // Faster theme check interval (reduced from 1000ms to 100ms)
    const themeCheckInterval = setInterval(updateTheme, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
      clearInterval(themeCheckInterval);
    };
  }, [theme]);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://room-mate-finder-server-zeta.vercel.app/rooms');
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on filter criteria
  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Room type filter
    if (filters.roomType) {
      filtered = filtered.filter(item =>
        item.roomType.toLowerCase() === filters.roomType.toLowerCase()
      );
    }

    // Rent range filter
    if (filters.minRent) {
      filtered = filtered.filter(item => item.rentAmount >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(item => item.rentAmount <= parseInt(filters.maxRent));
    }

    // Availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter(item =>
        filters.availability === 'available' ? item.availability : !item.availability
      );
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      const getLikeCount = (item) => {
        if (Array.isArray(item.likes)) return item.likes.length;
        if (typeof item.likes === 'number') return item.likes;
        if (item.likeCount) return item.likeCount;
        return 0;
      };

      switch (filters.sortBy) {
        case 'mostLiked':
          return getLikeCount(b) - getLikeCount(a);
        case 'leastLiked':
          return getLikeCount(a) - getLikeCount(b);
        case 'priceHigh':
          return b.rentAmount - a.rentAmount;
        case 'priceLow':
          return a.rentAmount - b.rentAmount;
        case 'oldest':
          return new Date(a.createdAt || a.datePosted || 0) - new Date(b.createdAt || b.datePosted || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || b.datePosted || 0) - new Date(a.createdAt || a.datePosted || 0);
      }
    });

    setFilteredListings(filtered);
  }, [filters, listings]);

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
      availability: 'all',
      sortBy: 'newest'
    });
  };

  // Get unique values for filter options
  const getUniqueValues = (key) => {
    return [...new Set(listings.map(item => item[key]).filter(Boolean))];
  };

  return (
    <div className={`min-h-screen transition-all duration-200 ease-in-out ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-18`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        
        {/* Header */}
        <div className={`rounded-xl p-6 mb-8 shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.01] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="animate-fadeInUp">
              <h1 className={`text-3xl font-bold transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Available Listings
              </h1>
              <p className={`mt-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Find your perfect living space • {filteredListings.length} results
              </p>
            </div>
            <div className="flex items-center gap-4 animate-fadeInUp animation-delay-100">
              {user && (
                <div className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {user?.displayName || user?.email || 'User'}
                </div>
              )}
              <Link
                to="/add-listing"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 hover:-translate-y-0.5"
              >
                + Add Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={`rounded-xl p-6 mb-8 shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.01] ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className={`text-lg font-semibold transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Filter & Search
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <FaFilter className={`mr-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {/* Search Bar - Always Visible */}
          <div className="relative mb-4 animate-fadeInUp">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 transform focus:scale-[1.02] ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Advanced Filters */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-4 animate-fadeInUp">
              {/* Sort By */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Room Type Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Room Type
                  </label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
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

                {/* Rent Range */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Min Rent
                  </label>
                  <input
                    type="number"
                    placeholder="Min rent"
                    value={filters.minRent}
                    onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Max Rent
                  </label>
                  <input
                    type="number"
                    placeholder="Max rent"
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                {/* Availability Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:scale-[1.02] ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="all">All</option>
                    <option value="available">Available</option>
                    <option value="taken">Taken</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 transform hover:scale-105 focus:scale-[1.02]
                      ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-blue-500'}
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading listings...
            </p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 px-6 animate-fadeIn">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-200 transform hover:scale-110 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className={`text-xl font-semibold mb-3 transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {listings.length === 0 ? 'No Listings Found' : 'No Results Found'}
            </h3>
            <p className={`mb-6 max-w-md mx-auto transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {listings.length === 0
                ? 'There are no roommate listings available at the moment.'
                : 'Try adjusting your filters to find more listings.'
              }
            </p>
            {listings.length === 0 ? (
              <Link
                to="/add-listing"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 hover:-translate-y-0.5"
              >
                + Add First Listing
              </Link>
            ) : (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item, index) => (
              <div
                key={item._id}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-xl font-bold transition-colors duration-200 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <span className="flex items-center text-sm font-medium text-pink-500 animate-pulse hover:animate-none transition-all duration-200 transform hover:scale-110">
                      <FaHeart className="mr-1" />
                      {(() => {
                        if (Array.isArray(item.likes)) return item.likes.length;
                        if (typeof item.likes === 'number') return item.likes;
                        if (item.likeCount) return item.likeCount;
                        if (item.likesCount) return item.likesCount;
                        return 0;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4 animate-slideInLeft">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.location}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center animate-slideInLeft animation-delay-100">
                      <FaBed className="mr-2 text-blue-500" />
                      <span className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.roomType}
                      </span>
                    </div>
                    <div className="flex items-center animate-slideInRight animation-delay-100">
                      <FaMoneyBillWave className="mr-2 text-green-500" />
                      <span className="font-semibold text-green-600">
                        ${item.rentAmount}/mo
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center animate-slideInUp animation-delay-200">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${item.availability
                        ? theme === 'dark'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-green-100 text-green-800'
                        : theme === 'dark'
                          ? 'bg-red-900 text-red-200'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {item.availability ? 'Available' : 'Taken'}
                    </span>
                    <Link
                      to={`/details/${item._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg"
                    >
                      <FaEye className="mr-2" /> View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default BrowseListings;