import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Lottie from 'lottie-react';
import { Typewriter } from 'react-simple-typewriter';
import { Fade, Slide, Bounce } from 'react-awesome-reveal';
import { Tooltip } from 'react-tooltip';

// Simple loading animation data
const loadingAnimation = {
  "v": "5.5.7",
  "fr": 60,
  "ip": 0,
  "op": 180,
  "w": 300,
  "h": 300,
  "nm": "Loading",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] }, { "t": 180, "s": [360] }] },
        "p": { "a": 0, "k": [150, 150] },
        "a": { "a": 0, "k": [0, 0] },
        "s": { "a": 0, "k": [100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [100, 100] },
              "p": { "a": 0, "k": [0, 0] }
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.3, 0.4, 0.9, 1] },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 8 }
            }
          ]
        }
      ],
      "ip": 0,
      "op": 180,
      "st": 0
    }
  ]
};


const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      // Apply theme to document
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    handleThemeChange(); // Initial call
    window.addEventListener('storage', handleThemeChange);
    const interval = setInterval(handleThemeChange, 100);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  // Fetch room data and user's like status
  useEffect(() => {
    const fetchRoomData = async () => {
      if (authLoading) return; // Wait for auth to load

      if (!user) {
        toast.error("You must be logged in to view room details");
        navigate('/login');
        return;
      }

      try {
        setLoading(true);

        // Fetch room details
        const roomResponse = await fetch(`http://localhost:3000/rooms/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!roomResponse.ok) {
          if (roomResponse.status === 404) {
            throw new Error('Room not found');
          }
          throw new Error('Failed to fetch room details');
        }

        const roomData = await roomResponse.json();
        setRoom(roomData);
        setLikeCount(roomData.likeCount || 0);

        // Check if current user has liked this room
        const likeStatusResponse = await fetch(`http://localhost:3000/rooms/${id}/like-status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (likeStatusResponse.ok) {
          const likeStatus = await likeStatusResponse.json();
          setHasLiked(likeStatus.hasLiked);
          setLikeCount(likeStatus.likeCount); // Use the count from backend
          setShowContact(likeStatus.hasLiked); // Show contact if user has already liked
        } else {
          console.warn('Could not fetch like status');
        }

      } catch (err) {
        console.error('Failed to load room details:', err);
        if (err.message === 'Room not found') {
          toast.error('Room not found');
        } else {
          toast.error('Failed to load room details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id, user, authLoading, navigate]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("You must be logged in to show interest in rooms");
      return;
    }

    if (likeLoading) return; // Prevent multiple clicks

    try {
      setLikeLoading(true);
      const method = hasLiked ? 'DELETE' : 'POST';

      const response = await fetch(`http://localhost:3000/rooms/${id}/like`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Update state based on backend response
        setLikeCount(result.likeCount);
        setHasLiked(result.hasLiked);
        setShowContact(result.hasLiked);

        if (result.hasLiked) {
          toast.success('Thank you for showing interest! Contact info revealed.');
        } else {
          toast.success('Interest removed');
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update interest status');
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      toast.error('Failed to update interest status. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  // Show loading screen while auth is loading
  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <Toaster />
        <Fade>
          <div className="text-center">
            <div className="w-32 h-32 mb-6">
              <Lottie animationData={loadingAnimation} loop={true} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <Typewriter
                words={['Loading Room Details...', 'Getting Ready...', 'Almost There...']}
                loop={true}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Checking authentication status
            </p>
          </div>
        </Fade>
      </div>
    );
  }

  // If user is not authenticated
  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <Toaster />
        <Bounce>
          <div className="max-w-md mx-auto">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'}`}>
              <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Access Required
            </h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Please log in to view room details and contact information.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Go to Login
            </Link>
          </div>
        </Bounce>
      </div>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Toaster />
        <div className="max-w-4xl mx-auto p-6 pt-20">
          <div className={`rounded-lg shadow-lg p-8 animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Title skeleton */}
            <div className={`h-8 rounded mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {/* Image placeholder */}
                <div className={`h-64 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

                {/* Text placeholders */}
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>

              <div className="space-y-4">
                {/* Sidebar placeholders */}
                <div className={`h-32 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-2/3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>

            {/* Like button placeholder */}
            <div className="mt-8 text-center">
              <div className={`h-12 w-48 rounded-full mx-auto ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Room not found state
  if (!room) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Toaster />
        <Slide direction="up">
          <div className="max-w-md mx-auto">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Room Not Found
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              The room you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-y-4">
              <Link
                to="/browse"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Browse All Listings
              </Link>
              <Link
                to="/"
                className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors duration-200 ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go Home
              </Link>
            </div>
          </div>
        </Slide>
      </div>
    );
  }


  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className=" px-4 md:px-20">
        <Toaster position="top-right" />

        {/* Breadcrumb */}
        <Fade>
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className={`inline-flex items-center text-sm font-medium hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-700'}`}>
                  <svg className="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <Link to="/browse" className={`ml-1 text-sm font-medium hover:text-blue-600 md:ml-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-700'}`}>
                    Browse Listings
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span className={`ml-1 text-sm font-medium md:ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Room Details</span>
                </div>
              </li>
            </ol>
          </nav>
        </Fade>

        <div className={`rounded-lg shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-200/50'}`}>
          {/* Header Section */}
          <Slide direction="down">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{room.title}</h1>
                  <div className="flex items-center text-indigo-100 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-lg">{room.location}</span>
                  </div>
                  <div className="text-indigo-200 text-sm">
                    <Typewriter
                      words={[`❤️ ${likeCount} people interested in this room`, 'Premium location available', 'Great opportunity awaits', 'Perfect for students and professionals']}
                      loop={true}
                      cursor
                      cursorStyle='|'
                      typeSpeed={70}
                      deleteSpeed={50}
                      delaySpeed={2000}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold text-white">৳{room.rentAmount}</div>
                  <div className="text-indigo-200">per month</div>
                </div>
              </div>
            </div>
          </Slide>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Interest Section */}
                <Bounce>
                  <div className="mb-8 text-center">
                    <div className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ❤️ {likeCount} people interested in this room
                    </div>
                    <button
                      onClick={handleLikeToggle}
                      disabled={loading}
                      data-tooltip-id="like-tooltip"
                      data-tooltip-content={hasLiked ? "Click to remove interest" : "Click to show interest and reveal contact"}
                      className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg ${loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : hasLiked
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                            : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:shadow-xl'
                        }`}
                    >
                      {loading ? '⏳ Processing...' : hasLiked ? '❤️ Interested' : '🤍 Show Interest'}
                    </button>
                    <Tooltip id="like-tooltip" className="z-50" />
                  </div>
                </Bounce>

                {/* Contact Information - Only show if user has liked */}
                {showContact && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                      🎉 Contact Information Revealed!
                    </h3>
                    <div className="space-y-2 text-green-700 dark:text-green-300">
                      <p><strong>Email:</strong> {room?.contactEmail || room?.userEmail}</p>
                      <p><strong>Phone:</strong> {room?.contactPhone || 'Not provided'}</p>
                      <p><strong>WhatsApp:</strong> {room?.whatsapp || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <Fade>
                <div className="mb-8">
                  <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Room Type</span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                        {room.roomType}
                      </span>
                    </div>
                    <div className={`p-4 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Availability</span>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.availability
                        ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                        }`}>
                        <span className={`w-2 h-2 mr-2 rounded-full ${room.availability ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {room.availability ? 'Available Now' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </Fade>

              {/* Lifestyle Preferences */}
              <Slide direction="left">
                <div className="mb-8">
                  <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    Lifestyle Preferences
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all hover:scale-105 ${room.lifestylePrefs?.pets
                      ? theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <span className="text-lg mr-2">🐕</span>
                      <span className="font-medium">Pets {room.lifestylePrefs?.pets ? 'Welcome' : 'Not Allowed'}</span>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all hover:scale-105 ${room.lifestylePrefs?.smoking
                      ? theme === 'dark' ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <span className="text-lg mr-2">🚬</span>
                      <span className="font-medium">Smoking {room.lifestylePrefs?.smoking ? 'Allowed' : 'Not Allowed'}</span>
                    </div>
                    <div className={`flex items-center px-4 py-2 rounded-lg transition-all hover:scale-105 ${room.lifestylePrefs?.nightOwl
                      ? theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <span className="text-lg mr-2">🌙</span>
                      <span className="font-medium">Night Owl {room.lifestylePrefs?.nightOwl ? 'Friendly' : 'Quiet Hours'}</span>
                    </div>
                  </div>
                </div>
              </Slide>

              {/* Description */}
              <Fade>
                <div className="mb-8">
                  <h2 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Description
                  </h2>
                  <div className={`p-6 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {room.description}
                    </p>
                  </div>
                </div>
              </Fade>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Slide direction="right">
                <div className={`sticky top-6 p-6 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Room Owner
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {room.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {room.userName}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Room Owner
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Rent</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>৳{room.rentAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Room Type</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{room.roomType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{room.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      💡 Tip: Click the "Show Interest" button above to reveal contact information!
                    </div>
                  </div>
                </div>
              </Slide>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default RoomDetails;