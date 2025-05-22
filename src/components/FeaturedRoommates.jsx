import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedRoommates = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/rooms/available?limit=6') // Make sure server supports limit
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="my-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Roommate Posts</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post._id} className="card bg-white dark:bg-gray-800 shadow-md p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p><strong>Location:</strong> {post.location}</p>
            <p><strong>Rent:</strong> {post.rentAmount}</p>
            <p className="truncate">{post.description}</p>
            <Link to={`/details/${post._id}`} className="btn btn-sm btn-info mt-3">See More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRoommates;
