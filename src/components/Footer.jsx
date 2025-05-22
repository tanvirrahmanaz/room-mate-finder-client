import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        
        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Phone: +880123456789</p>
          <p>Email: support@roommatefinder.com</p>
          <p>Address: Dhaka, Bangladesh</p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-2">Services</h4>
          <ul className="space-y-1">
            <li>Roommate Listings</li>
            <li>User Dashboard</li>
            <li>Safe Messaging</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <ul className="space-y-1">
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs mt-6 text-gray-400">
        &copy; {new Date().getFullYear()} RoomMate Finder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
