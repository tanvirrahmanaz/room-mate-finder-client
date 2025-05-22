import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        setRoom(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load post:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading details...</p>;

  if (!room) return <p className="text-center text-red-500 mt-10">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{room.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p><strong className="text-gray-700 dark:text-gray-300">📍 Location:</strong> {room.location}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">💰 Rent:</strong> {room.rentAmount} BDT</p>
          <p><strong className="text-gray-700 dark:text-gray-300">🛏️ Room Type:</strong> {room.roomType}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">📞 Contact Info:</strong> {room.contactInfo}</p>
        </div>

        <div>
          <p><strong className="text-gray-700 dark:text-gray-300">🐶 Pets Allowed:</strong> {room.lifestylePrefs?.pets ? 'Yes' : 'No'}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">🚬 Smoking:</strong> {room.lifestylePrefs?.smoking ? 'Yes' : 'No'}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">🌙 Night Owl:</strong> {room.lifestylePrefs?.nightOwl ? 'Yes' : 'No'}</p>
          <p><strong className="text-gray-700 dark:text-gray-300">📅 Availability:</strong> {room.availability ? 'Available' : 'Not Available'}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-700 dark:text-gray-300"><strong>Description:</strong></p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{room.description}</p>
      </div>

      <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Posted by:</strong> {room.userName}</p>
        <p><strong>Email:</strong> {room.userEmail}</p>
      </div>
    </div>
  );
};

export default RoomDetails;
