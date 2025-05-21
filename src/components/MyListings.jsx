import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyListings = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:3000/rooms?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setMyListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
        setLoading(false);
      });
  }, [userEmail]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/rooms/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Deleted successfully');
        setMyListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting listing');
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading your listings...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Roommate Listings</h2>
      {myListings.length === 0 ? (
        <p className="text-gray-500">You haven't added any listings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th>Title</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myListings.map((item) => (
                <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2">{item.title}</td>
                  <td>{item.location}</td>
                  <td>${item.rentAmount}</td>
                  <td>{item.availability ? 'Yes' : 'No'}</td>
                  <td className="flex gap-2 mt-2">
                    <Link to={`/update/${item._id}`} className="btn btn-sm btn-warning">Update</Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyListings;
