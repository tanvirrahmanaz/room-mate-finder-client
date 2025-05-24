import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing post data
  useEffect(() => {
    fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load post");
      });
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name in (formData?.lifestylePrefs || {})) {
      setFormData(prev => ({
        ...prev,
        lifestylePrefs: {
          ...prev.lifestylePrefs,
          [name]: checked
        }
      }));
    } else if (name === 'availability') {
      setFormData(prev => ({ ...prev, availability: value === 'Available' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    });

    if (!confirmed.isConfirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await Swal.fire('Updated!', 'Your post has been updated.', 'success');
        navigate('/my-listings');
      } else {
        Swal.fire('Failed!', 'Could not update post.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Update Roommate Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input input-bordered w-full" placeholder="Title" />

        {/* Location */}
        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input input-bordered w-full" placeholder="Location" />

        {/* Rent Amount */}
        <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} required className="input input-bordered w-full" placeholder="Rent" />

        {/* Room Type */}
        <select name="roomType" value={formData.roomType} onChange={handleChange} className="select select-bordered w-full">
          <option>Single</option>
          <option>Shared</option>
          <option>Studio</option>
          <option>Other</option>
        </select>

        {/* Lifestyle Preferences */}
        <div className="flex gap-4">
          {['pets', 'smoking', 'nightOwl'].map(key => (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" name={key} checked={formData.lifestylePrefs[key]} onChange={handleChange} className="checkbox" />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>

        {/* Description */}
        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="textarea textarea-bordered w-full" placeholder="Description" />

        {/* Contact Info */}
        <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required className="input input-bordered w-full" placeholder="Contact Info" />

        {/* Availability */}
        <select name="availability" value={formData.availability ? 'Available' : 'Not Available'} onChange={handleChange} className="select select-bordered w-full">
          <option>Available</option>
          <option>Not Available</option>
        </select>

        {/* Read-Only Email */}
        <input type="email" value={formData.userEmail || ''} readOnly disabled className="input input-bordered w-full bg-gray-200" />

        {/* Read-Only Name */}
        <input type="text" value={formData.userName || ''} readOnly disabled className="input input-bordered w-full bg-gray-200" />

        {/* Submit Button */}
        <button type="submit" disabled={loading} className={`btn btn-primary w-full ${loading ? 'opacity-50' : ''}`}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default UpdateListing;
