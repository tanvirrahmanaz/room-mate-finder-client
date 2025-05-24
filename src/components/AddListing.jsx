import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AddListing = () => {
  const { user, loading } = useContext(AuthContext); // ✅ Get loading from AuthContext
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  
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

  // ✅ Handle initial loading and authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for Firebase auth to complete
      if (loading) {
        return; // Don't do anything while Firebase is still checking auth
      }
      
      // Show loading for at least 1 second for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        toast.error("You must be logged in to add a listing");
        navigate('/login');
      } else {
        setUserEmail(user.email);
        setUserName(user.displayName || user.name || 'No name');
      }
      
      setInitialLoading(false);
    };
    
    checkAuth();
  }, [user, loading, navigate]); // ✅ Add loading to dependencies

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rentAmount: '',
    roomType: 'Single',
    lifestylePrefs: {
      pets: false,
      smoking: false,
      nightOwl: false,
    },
    description: '',
    contactInfo: '',
    contactNumber: '',
    availability: true,
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name in formData.lifestylePrefs) {
      setFormData((prev) => ({
        ...prev,
        lifestylePrefs: {
          ...prev.lifestylePrefs,
          [name]: checked,
        },
      }));
    } else if (name === 'availability') {
      setFormData((prev) => ({ ...prev, availability: value === 'Available' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const dataToSend = {
      ...formData,
      userEmail,
      userName,
    };

    try {
      const response = await fetch('https://room-mate-finder-server-zeta.vercel.app/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': user?.accessToken ? `Bearer ${user.accessToken}` : ''
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success('Listing added successfully!');
        setFormData({
          title: '',
          location: '',
          rentAmount: '',
          roomType: 'Single',
          lifestylePrefs: {
            pets: false,
            smoking: false,
            nightOwl: false,
          },
          description: '',
          contactInfo: '',
          contactNumber: '',
          availability: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add listing');
      }
    } catch (error) {
      toast.error('Error connecting to server');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  // Loading screen component - Show while Firebase auth is loading OR initial loading
  if (loading || initialLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Toaster 
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
        <div className="text-center">
          {/* Spinner */}
          <div className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4 ${
            theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
          }`}></div>
          
          {/* Loading text */}
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Loading Add Listing...
          </h2>
          
          {/* Sub text */}
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Checking authentication status
          </p>
          
          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
            }`} style={{animationDelay: '0.1s'}}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
            }`} style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated after loading
  if (!loading && !user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <Toaster 
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === 'dark' ? 'bg-red-900' : 'bg-red-100'
            }`}>
              <svg className={`w-8 h-8 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Authentication Required
          </h2>
          
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            You need to log in to add a listing. Please sign in to continue.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
            </svg>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-16 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-3xl mx-auto p-6 rounded-lg shadow-lg mt-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
        
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Add a Roommate Listing
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Title *
            </label>
            <input
              name="title"
              type="text"
              placeholder="Looking for a roommate in NYC"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Location */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Location *
            </label>
            <input
              name="location"
              type="text"
              placeholder="Mirpur,Dhanmondi etc"
              value={formData.location}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Rent Amount */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Rent Amount *
            </label>
            <input
              name="rentAmount"
              type="number"
              placeholder="1200"
              value={formData.rentAmount}
              onChange={handleChange}
              required
              min="0"
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Room Type */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Room Type *
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option>Single</option>
              <option>Shared</option>
              <option>Studio</option>
              <option>Other</option>
            </select>
          </div>

          {/* Lifestyle Preferences */}
          <div>
            <label className={`block font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Lifestyle Preferences
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="pets"
                  checked={formData.lifestylePrefs.pets}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pets
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="smoking"
                  checked={formData.lifestylePrefs.smoking}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Smoking
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="nightOwl"
                  checked={formData.lifestylePrefs.nightOwl}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Night Owl
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Write a brief description about the room and your preferences"
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            ></textarea>
          </div>

          {/* Contact Info Email */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contact Email
            </label>
            <input
              name="contactInfo"
              type="email"
              placeholder="your.email@example.com"
              value={formData.contactInfo}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Contact Phone Number */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contact Phone Number *
            </label>
            <input
              name="contactNumber"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Availability */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Availability *
            </label>
            <select
              name="availability"
              value={formData.availability ? 'Available' : 'Not Available'}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option>Available</option>
              <option>Not Available</option>
            </select>
          </div>

          {/* User Email (read-only) */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              User Email
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              disabled
              className={`w-full px-4 py-3 rounded-lg border cursor-not-allowed ${
                theme === 'dark' 
                  ? 'bg-gray-600 border-gray-500 text-gray-400' 
                  : 'bg-gray-200 border-gray-300 text-gray-600'
              }`}
            />
          </div>

          {/* User Name (read-only) */}
          <div>
            <label className={`block font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              User Name
            </label>
            <input
              type="text"
              value={userName}
              readOnly
              disabled
              placeholder="User Name"
              className={`w-full px-4 py-3 rounded-lg border cursor-not-allowed ${
                theme === 'dark' 
                  ? 'bg-gray-600 border-gray-500 text-gray-400 placeholder-gray-500' 
                  : 'bg-gray-200 border-gray-300 text-gray-600 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={formLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                formLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105'
              }`}
            >
              {formLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Listing...
                </div>
              ) : (
                'Add Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;