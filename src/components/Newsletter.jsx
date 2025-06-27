// src/components/Newsletter.jsx

import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <div className="py-16 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-3xl font-extrabold text-base-content">
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-4 text-lg text-base-content/70 max-w-2xl mx-auto">
          Get the latest updates on new listings, tips for finding the perfect roommate, and exclusive offers delivered straight to your inbox.
        </p>
        <form className="mt-8 sm:flex justify-center">
          <div className="min-w-0 flex-1">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="block w-full px-5 py-3 text-base text-base-content placeholder-base-content/50 shadow-sm focus:ring-primary focus:border-primary border-base-300 rounded-md"
            />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <button
              type="submit"
              className="block w-full py-3 px-5 rounded-md shadow bg-primary text-primary-content font-medium hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;