import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BrowseListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch listings:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading listings...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">All Roommate Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th>Title</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Room Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2">{item.title}</td>
                  <td>{item.location}</td>
                  <td>${item.rentAmount}</td>
                  <td>{item.roomType}</td>
                  <td>
                    <Link
                      to={`/details/${item._id}`}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      See More
                    </Link>
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

export default BrowseListings;
