import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X, User, LogOut, Home, Users, List, Plus, Info } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/room-mate-logo.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const popupRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const allNavItems = [
    { name: 'Home', path: '/', icon: Home, isPrivate: false },
    { name: 'Find Roommate', path: '/add-listing', icon: Plus, isPrivate: true },
    { name: 'Browse Listings', path: '/browse', icon: List, isPrivate: false },
    { name: 'My Listings', path: '/my-listings', icon: Users, isPrivate: true },
    { name: 'About Us', path: '/about', icon: Info, isPrivate: false },
  ];

  const visibleNavItems = allNavItems.filter(item => !item.isPrivate || user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setUserPopupOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (userPopupOpen) {
        setUserPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userPopupOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setImgError(false);
    });
    return unsubscribe;
  }, [auth]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    window.dispatchEvent(new Event('themeChanged'));
  };
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserPopupOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300/50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200"
              >
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Room Mate Finder" 
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-full transition-all duration-200"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                  Room Mate Finder
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-focus'
                        : 'text-base-content/70 hover:bg-base-200/50 hover:text-primary'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              
              {/* CHANGE: New smooth theme toggle button */}
              <button
                onClick={handleToggleTheme}
                className="relative w-14 h-7 rounded-full p-1 flex items-center bg-base-200 dark:bg-gray-700 transition-colors duration-50"
              >
                <div
                  className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  {/* Sun Icon */}
                  <Sun
                    className={`text-yellow-500 transition-all duration-300 ease-in-out transform ${
                      theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                    }`}
                    size={16}
                  />
                  {/* Moon Icon */}
                  <Moon
                    className={`absolute text-slate-800 transition-all duration-300 ease-in-out transform ${
                      theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                    }`}
                    size={16}
                  />
                </div>
              </button>

              {user ? (
                <div 
                  className="relative group" 
                  ref={popupRef}
                >
                  <button
                    onClick={() => setUserPopupOpen(!userPopupOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-base-200/50 transition-all duration-200 group"
                  >
                    {!imgError && user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-base-300 group-hover:ring-primary transition-all duration-200"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-primary-content font-semibold text-sm ring-2 ring-base-300 group-hover:ring-primary transition-all duration-200">
                        {getInitial()}
                      </div>
                    )}
                  </button>

                  <div className={`absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-300/50 py-2 z-50 transition-all duration-200 ${
                    userPopupOpen 
                      ? 'opacity-100 visible transform translate-y-0' 
                      : 'opacity-0 invisible transform -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="px-4 py-3 border-b border-base-300/50">
                      <p className="text-sm font-semibold text-base-content truncate">
                        {user.displayName || 'No name'}
                      </p>
                      <p className="text-xs text-base-content/70 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-100"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link to="/login" className="btn btn-ghost btn-sm">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm text-primary-content transform hover:scale-105">
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-base-200/50"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-base-100/95 backdrop-blur-md border-b border-base-300/50 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content/70 hover:bg-base-200/50 hover:text-primary'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {!user && (
                 <div className="pt-4 border-t border-base-300/50 flex items-center space-x-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-ghost w-1/2">Sign In</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-1/2">Sign Up</Link>
                 </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;