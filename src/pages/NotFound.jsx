import React from 'react';
import { Link } from 'react-router-dom';
import errorImage from '../assets/error.jpg';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4">
      <img src={errorImage} alt="404 Not Found" className="max-w-md mb-6" />
      <h1 className="text-4xl font-bold text-gray-700 dark:text-white mb-4">Oops! Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-300 mb-6">Sorry, the page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="btn btn-primary px-6 py-2 rounded-md text-white hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
