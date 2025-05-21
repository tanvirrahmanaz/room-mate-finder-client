import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/room-mate-logo.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    };
    if (popupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImgError(false); // reset image error on user change
    });
    return unsubscribe;
  }, [auth]);

  const handleToggleTheme = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className="navbar bg-gray-100 text-black shadow-md dark:bg-gray-900 dark:text-white" style={{ height: '64px' }}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-listing">Find Roommate</Link>
            </li>
            <li>
              <Link to="/browse">Browse Listing</Link>
            </li>
            <li>
              <Link to="/my-listings">My Listings</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2 ml-2">
          <img src={logo} alt="Logo" className="h-10 w-10 object-cover rounded-full" />
          <span className="text-xl font-bold hidden sm:inline">Room Mate Finder</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add-listing">Find Roommate</Link>
          </li>
          <li>
            <Link to="/browse">Browse Listing</Link>
          </li>
          <li>
            <Link to="/my-listings">My Listings</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end flex items-center gap-4 relative">
        {/* Theme Toggle */}
        <label className="swap swap-rotate">
          <input
            onChange={handleToggleTheme}
            type="checkbox"
            className="theme-controller"
            checked={theme === 'dark'}
          />
          <Sun className="swap-off h-10 w-10 fill-current" />
          <Moon className="swap-on h-10 w-10 fill-current" />
        </label>

        {user ? (
           <div
            className="relative flex items-center cursor-pointer select-none group"
            onClick={() => setPopupOpen((prev) => !prev)}
            ref={popupRef}
          >
            {/* Avatar or initial */}
            {!imgError && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                onError={() => setImgError(true)}
                title={user.displayName || user.email}
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg border border-gray-300 dark:border-gray-600"
                title={user.displayName || user.email}
              >
                {getInitial()}
              </div>
            )}

            {/* Hover popup */}
             <div
              className={`absolute right-2 mt-40 w-56 bg-white dark:bg-gray-800 rounded shadow-lg p-4 z-20 text-sm text-gray-900 dark:text-gray-100
                opacity-0 pointer-events-none
                transition-opacity
                group-hover:opacity-100  group-hover:pointer-events-auto
                ${popupOpen ? 'opacity-100 pointer-events-auto' : ''}
              `}
            >
              <p className="font-semibold truncate" title={user.displayName || ''}>
                {user.displayName || 'No name'}
              </p>
              <p className="truncate mb-4" title={user.email}>
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm w-full"
                type="button"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;