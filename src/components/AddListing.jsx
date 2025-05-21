import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

const AddListing = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
      setUserName(user.displayName || 'No name');
    }
  }, [user]);

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
      setLoading(false);
    }
  };
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
          disabled={loading}
          className={`btn btn-primary w-full mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddListing;