import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const AddListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // ✅ Handle initial loading and authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Show loading for at least 1 second for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        toast.error("You must be logged in to add a listing");
        navigate('/login');
      } else {
        setUserEmail(user.email);
        setUserName(user.displayName || 'No name');
      }
      
      setInitialLoading(false);
    };

    checkAuth();
  }, [user, navigate]);

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
      const response = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Loading screen component
  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
        <Toaster />
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          
          {/* Loading text */}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Add Listing...
          </h2>
          
          {/* Sub text */}
          <p className="text-gray-500 dark:text-gray-400">
            Checking authentication status
          </p>
          
          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Authentication Required
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to log in to add a listing. Please sign in to continue.
          </p>
          
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
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
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add a Roommate Listing</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            name="title"
            type="text"
            placeholder="Looking for a roommate in NYC"
            value={formData.title}
            onChange={handleChange}
            required
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
          <input
            name="location"
            type="text"
            placeholder="New York City"
            value={formData.location}
            onChange={handleChange}
            required
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Rent Amount */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Rent Amount *</label>
          <input
            name="rentAmount"
            type="number"
            placeholder="1200"
            value={formData.rentAmount}
            onChange={handleChange}
            required
            min="0"
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type *</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Single</option>
            <option>Shared</option>
            <option>Studio</option>
            <option>Other</option>
          </select>
        </div>

        {/* Lifestyle Preferences */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Lifestyle Preferences</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pets"
                checked={formData.lifestylePrefs.pets}
                onChange={handleChange}
                className="checkbox"
              />
              Pets
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="smoking"
                checked={formData.lifestylePrefs.smoking}
                onChange={handleChange}
                className="checkbox"
              />
              Smoking
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="nightOwl"
                checked={formData.lifestylePrefs.nightOwl}
                onChange={handleChange}
                className="checkbox"
              />
              Night Owl
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Write a brief description"
            className="textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Info *</label>
          <input
            name="contactInfo"
            type="text"
            placeholder="Phone or email"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Availability *</label>
          <select
            name="availability"
            value={formData.availability ? 'Available' : 'Not Available'}
            onChange={handleChange}
            className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Available</option>
            <option>Not Available</option>
          </select>
        </div>

        {/* User Email (read-only) */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">User Email</label>
          <input
            type="email"
            value={userEmail}
            readOnly
            disabled
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
          />
        </div>

        {/* User Name (read-only) */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">User Name</label>
          <input
            type="text"
            value={userName}
            readOnly
            disabled
            className="input input-bordered w-full bg-gray-200 dark:bg-gray-600 cursor-not-allowed" 
            placeholder='User Name'
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formLoading}
          className={`btn btn-primary w-full mt-4 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {formLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            'Add Listing'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddListing;